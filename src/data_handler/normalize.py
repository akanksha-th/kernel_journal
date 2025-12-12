import numpy as np
import json
from src.config.paths import NORMALIZATION_PARAMS

def compute_norm_params(imu_train):
    params = {
        "acce_mean": imu_train[:, 0:3].mean(0).tolist(),
        "acce_std": imu_train[:, 0:3].std(0).tolist(),
        "gyro_mean": imu_train[:, 3:6].mean(0).tolist(),
        "gyro_std": imu_train[:, 3:6].std(0).tolist(),
        "mag_mean": imu_train[:, 6:9].mean(0).tolist(),
        "mag_std": imu_train[:, 6:9].std(0).tolist(),
    }

    with open(NORMALIZATION_PARAMS, "w") as f:
        json.dump(params, f, indent=4)

    return params

def apply_normalization(imu, params):

    imu = imu.copy()

    imu[:,0:3] = (imu[:,0:3] - params["acce_mean"]) / params["acce_std"]
    imu[:,3:6] = (imu[:,3:6] - params["gyro_mean"]) / params["gyro_std"]
    imu[:,6:9] = (imu[:,6:9] - params["mag_mean"]) / params["mag_std"]

    return imu

