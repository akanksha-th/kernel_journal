import torch, os, numpy as np
from torch.utils.data import Dataset

class IMUDatasetOrientation(Dataset):
    """
    IMU → Orientation (Quaternion) dataset

    Each sample:
        input : (T, 6)  [acce (3), gyro (3)]
        target: (4,)    quaternion at last timestep
    """
    def __init__(self,
                 root_dir: str, # path to data root
                 split: str,    # split name
                 window_size: int = 200,    # IMU window length
                 stride: int = 20,  # stride between windows
                 normalize: bool = True,    # whether to z-score IMU
                 stats_path: str = None,    # path to save normalization stats
                 ):
        
        self.root_dir = root_dir
        self.split = split
        self.window_size = window_size
        self.stride = stride
        self.normalize = normalize
        self.stats_path = stats_path

        split_path = os.path.join(self.root_dir, self.split)
        assert os.path.exists(split_path), f"Split not found: {split_path}"

        self.sequences = []
        self.index_map = []

        # —————————————————————————————————————————
        # Load Sequences
        # —————————————————————————————————————————
        folders = os.listdir(split_path)
        for folder in folders:
            rawfile_path = os.path.join(split_path, folder, "rawdata.npy")
            gt_path = os.path.join(split_path, folder, "groundtruth.npy")

            if not (os.path.exists(rawfile_path)) and os.path.exists(gt_path):
                continue

            imu = np.load(rawfile_path)[:, 1:7]
            quat = np.load(gt_path)[:, 1:]
            quat = quat / np.linalg.norm(quat, axis=1, keepdims=True)

            N = imu.shape[0]
            if N < window_size:
                continue

            seq_id = len(self.sequences)
            self.sequences.append({"imu": imu, "quat": quat})

            # build index map
            last_start = N - window_size
            for start in range(0, last_start+1, stride):
                self.index_map.append((seq_id, start))

        assert len(self.index_map) > 0, "No valid windows found. Alter the 'window_size' and 'stride' values."

        # —————————————————————————————————————————
        # Normalization
        # —————————————————————————————————————————
        if self.normalize:
            if stats_path is not None and os.path.exists(stats_path):
                stats = np.load(stats_path)
                self.acce_mean, self.acce_std = stats["acce_mean"], stats["acce_std"]
                self.gyro_mean, self.gyro_std = stats["gyro_mean"], stats["gyro_std"]
            else:
                self._compute_normalization_stats()
                if stats_path is not None:
                    os.makedirs(os.path.dirname(stats_path), exist_ok=True)
                    np.savez(
                        stats_path,
                        acce_mean=self.acce_mean,
                        acce_std=self.acce_std,
                        gyro_mean=self.gyro_mean,
                        gyro_std=self.gyro_std
                    )

    def _compute_normalization_stats(self):
        acce_all, gyro_all = [], []

        for seq in self.sequences:
            imu = seq["imu"]
            acce_all.append(imu[:, :3])
            gyro_all.append(imu[:, 3:])

        acce_all = np.concatenate(acce_all, axis=0)
        gyro_all = np.concatenate(gyro_all, axis=0)

        self.acce_mean = acce_all.mean(axis=0)
        self.acce_std = acce_all.std(axis=0) + 1e-8
        self.gyro_mean = gyro_all.mean(axis=0)
        self.gyro_std = gyro_all.std(axis=0) + 1e-8

    def _normalize_imu(self, imu):
        imu = imu.copy()
        imu[:, :3] = (imu[:, :3] - self.acce_mean) / self.acce_std
        imu[:, 3:] = (imu[:, 3:] - self.gyro_mean) / self.gyro_std
        return imu

    def __len__(self):
        return len(self.index_map)
    
    def __getitem__(self, idx):
        seq_id, start = self.index_map[idx]

        imu = self.sequences[seq_id]["imu"][
            start : start + self.window_size
        ]

        quat = self.sequences[seq_id]["quat"][
            start + self.window_size -1
        ]
        if self.normalize:
            imu = self._normalize_imu(imu)

        return (
            torch.from_numpy(imu).float(),  # (T, 6)
            torch.from_numpy(quat).float()  # (4, )
        )