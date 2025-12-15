import os, numpy as np
from data_load.imu_dataset import IMUDataset

DATA_DIR = "data/raw_data/"
OUTPUT_PATH = "data/processed"
FOLDER_SPLIT = ["train_dataset", "val_dataset", "test_unseen", "test_seen"]

def extract_windows(imu, quat, window_size=100, stride=20):
    X, Y = [], []
    N = imu.shape[0]
    last_start = N - window_size

    if last_start < 0:
        return None, None
    
    for start in range(0, last_start+1, stride):
        imu_window = imu[start : start + window_size]
        quat_target = quat[start + window_size -1]

        X.append(imu_window)
        Y.append(quat_target)

    return np.stack(X), np.stack(Y)

def normalization(X_all):
    acce = X_all[:, :, :3].reshape(-1, 3)
    gyro = X_all[:, :, 3:].reshape(-1, 3)

    acce_mean, acce_std = acce.mean(0), acce.std(0)
    gyro_mean, gyro_std = gyro.mean(0), gyro.std(0)

    X_all_norm = X_all.copy()

    X_all_norm[:, :, :3] = (X_all[:, :, :3] - acce_mean) / acce_std
    X_all_norm[:, :, 3:] = (X_all[:, :, 3:] - gyro_mean) / gyro_std

    return X_all_norm

# ==================================
# TRAINING DATA
# ==================================
all_X = []
all_y = []
skipped = 0

for split in FOLDER_SPLIT[0]:
    folder_path = os.path.join(DATA_DIR, split)
    folders = os.listdir(folder_path)
    for folder in folders:
        rawfile_path = os.path.join(folder_path, folder, "rawdata.npy")
        gt_path = os.path.join(folder_path, folder, "groundtruth.py")

        imu = np.load(rawfile_path)[:, 1:7]
        quat = np.load(gt_path)[:, 1:]

        X, y = extract_windows(imu, quat)

        if X is None:
            skipped += 1
            continue

        all_X.append(X)
        all_y.append(y)

X_train = np.concatenate(all_X, axis=0)
y_train = np.concatenate(all_y, axis=0)

X_train_norm = normalization(X_train)
np.save(os.path.join(OUTPUT_PATH, "X_train.npy"), X_train_norm)