import numpy as np

def create_windows(imu, gt, window_size=200, overlap=0.5):
    step = int(window_size * (1-overlap))
    X, Y = [], []

    for start in range(0, len(imu) - window_size, step):
        end = start + window_size
        X.append(imu[start:end, 1:])
        Y.append(gt[end-1, 4:])

    return np.array(X), np.array(Y)