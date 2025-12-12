import numpy as np
from src.utils.timestamp_utils import compute_dt_stats, resample_to_constant_rate
from src.utils.quaternion_ops import fix_quat_signs

def preprocess_imu_gt(imu, gt, target_hz = 200):
    timestamps_imu = imu[:, 0]
    timestamps_gt = gt[:, 0]

    compute_dt_stats(timestamps_imu)

    imu_resampled = resample_to_constant_rate(imu, timestamps_imu, target_hz)

    # fix quaternion sign flips
    gt[:, 4:] = fix_quat_signs(gt[:, 4:])

    return imu_resampled, gt