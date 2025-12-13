import json
from oldie.data_handler.load_data import load_imu_and_gt
from oldie.data_handler.normalize import apply_normalization
from oldie.data_handler.build_dataset import build_and_save_windows
from oldie.config.paths import NORMALIZATION_PARAMS

sequence = "train_dataset/101office1"

imu, gt = load_imu_and_gt(sequence)

# Load norm params
with open(NORMALIZATION_PARAMS) as f:
    params = json.load(f)

imu_norm = apply_normalization(imu, params)

X, Y = build_and_save_windows(imu_norm, gt, seq_name=sequence)

print("Windows created:", X.shape, Y.shape)
