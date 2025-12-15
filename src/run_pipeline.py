from src.data_load.imu_dataset import IMUDatasetOrientation
from torch.utils.data import DataLoader


def main():
    dataset = IMUDatasetOrientation(
        root_dir="data/raw_data",
        split="train_dataset",
        window_size=200,
        stride=20,
        normalize=True,
        stats_path="data/processed/train_stats.npz",
    )

    print("Total windows:", len(dataset))
    # x, q = dataset[0]
    # print(x.shape, q.shape)

    loader = DataLoader(
        dataset,
        batch_size=64,
        shuffle=True,
        num_workers=4,
        pin_memory=True
    )

    x, q = next(iter(loader))
    print(x.shape, q.shape)


if __name__ == "__main__":
    main()