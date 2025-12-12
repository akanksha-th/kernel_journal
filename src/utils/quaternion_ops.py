import numpy as np

def fix_quat_signs(q):
    q = q.copy()
    for i in range(1, len(q)):
        if np.dot(q[i], q[i-1]) < 0:
            q[i] = -q[i]
    return q
