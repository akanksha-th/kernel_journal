## Final Decisions – Project Plan (Teacher Model Focus)

### 1. Problem Framing

* Input: **IMU time-series data**

  * Accelerometer (3), Gyroscope (3), Magnetometer (optional later)
  * All **in body frame**
* Output: **Orientation only (quaternions)**

  * In **global/world frame**
* We **do NOT** predict position or velocity.

---

### 2. Ingestion Pipeline (for prototype)

* Load raw IMU + groundtruth
* Window IMU data (fixed window, stride-based)
* Align windows with groundtruth quaternions
* No heavy calibration / denoising for now
* Normalization per sensor type
* PyTorch `Dataset + DataLoader`
* Infinite loader for training, finite for val/test

(Other ingestion improvements postponed)

---

### 3. Model Choice (Teacher)

* **NeurIT (Neural Inertial Tracking)** used as **teacher model**
* Reason:

  * Physics-aware
  * Continuous-time (CDE/ODE-based)
  * Strong inductive bias for IMU data
  * Research-grade architecture

---

### 4. Frame Handling

* IMU inputs remain in **body frame**
* **No manual body → global transformation**
* NeurIT internally learns orientation dynamics
* Global orientation emerges naturally via integration

---

### 5. Model Modification

* Keep NeurIT encoder + latent dynamics **unchanged**
* Modify **output head**:

  * Predict **quaternions only**
* Remove velocity and position heads

---

### 6. Training Objective

* Use **quaternion geodesic loss** (not MSE)
* Normalize quaternions before loss
* Loss measures angular distance on **S³ manifold**

---

### 7. Training Strategy

* Supervised training using groundtruth quaternions
* Window-level training
* Teacher model is **heavy, accurate, robust**

---

### 8. Feature Engineering

* **No manual feature engineering**
* Raw IMU time-series fed directly
* Encoder learns representations

---

### 9. Student Model (later)

* Student can be **any size / any type**

  * Small NN, GRU, CNN, SVM, XGBoost, etc.
* Student learns via **distillation from teacher**
* No architectural constraint between teacher and student

---

### 10. Research Contribution Angle

* Orientation-only adaptation of NeurIT
* Efficient teacher–student distillation for IMU orientation
* Clean separation: **physics-rich teacher → lightweight student**
