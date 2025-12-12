import numpy as np
import os
from src.config.paths import WINDOWED_DATA
from src.data_handler.windowing import create_windows

def build_and_save_windows(imu, gt, seq_name, window_size=200, overlap=0.5):
    X, Y = create_windows(imu, gt, window_size, overlap)

    save_dir = os.path.join(WINDOWED_DATA, seq_name)
    os.makedirs(save_dir, exist_ok=True)

    np.save(os.path.join(save_dir, "X.npy"), X)
    np.save(os.path.join(save_dir, "Y.npy"), Y)

    return X, Y