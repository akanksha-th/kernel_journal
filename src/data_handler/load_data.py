import numpy as np
import os 
from src.config.paths import DATA_RAW

def load_imu_and_gt(sequence_name: str):
    imu_path = os.path.join(DATA_RAW, sequence_name, "rawdata.npy")
    gt_path = os.path.join(DATA_RAW, sequence_name, "groundtruth.npy")

    imu = np.load(imu_path)
    gt = np.load(gt_path)

    return imu, gt