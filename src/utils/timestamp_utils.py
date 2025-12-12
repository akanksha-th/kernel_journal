import numpy as np

def compute_dt_stats(timestamps):
    dt = np.diff(timestamps)
    print(f"Mean dt: {dt.mean()}, Std dt: {dt.std()}")

def resample_to_constant_rate(data, timestamps, target_hz):
    target_dt = 1.0 / target_hz
    new_timestamps = np.arange(timestamps[0], timestamps[-1], target_dt)

    new_data = np.zeros((len(new_timestamps), data.shape[-1]))
    new_data[:, 0] = new_timestamps

    for i in range(1, data.shape[1]):
        new_data[:, i] = np.interp(new_timestamps, timestamps, data[:, i])

    return new_data