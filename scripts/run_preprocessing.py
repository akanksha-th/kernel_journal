from src.data_handler.load_data import load_imu_and_gt
from src.data_handler.preprocess import preprocess_imu_gt
from src.data_handler.normalize import compute_norm_params

sequence = "train_dataset/101office1"

imu, gt = load_imu_and_gt(sequence)
imu_resampled, gt_fixed = preprocess_imu_gt(imu, gt)

params = compute_norm_params(imu_resampled)

print("Preprocessing + normalization params saved.")
