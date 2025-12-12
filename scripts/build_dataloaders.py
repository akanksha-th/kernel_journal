import numpy as np
from torch.utils.data import DataLoader
from src.dataloaders.imu_dataset import IMUDataset

X = np.load("data/processed/windows/train_dataset/101office1/X.npy")
Y = np.load("data/processed/windows/train_dataset/101office1/Y.npy")

dataset = IMUDataset(X, Y)

loader = DataLoader(dataset, batch_size=64, shuffle=True)

print("Dataloader ready.")
