// Content model for the Kernel Journal site.
// Edit this file as weeks are completed and posts go live —
// nothing else in the repo needs to change.

const TRACKS = {
  image:  { label: "Image",         color: "var(--track-image)" },
  audio:  { label: "Audio",         color: "var(--track-audio)" },
  systems:{ label: "Systems / Both",color: "var(--track-systems)" }
};

const MONTHS = [
  {
    id: "m1",
    number: 1,
    title: "Memory Fundamentals",
    range: "Weeks 1–4",
    weeks: [1, 2, 3, 4]
  },
  {
    id: "m2",
    number: 2,
    title: "Cache, Raw CUDA, and the Frequency Domain",
    range: "Weeks 5–8",
    weeks: [5, 6, 7, 8]
  },
  {
    id: "m3",
    number: 3,
    title: "PyTorch Internals, Precision, and Deeper Profiling",
    range: "Weeks 9–12",
    weeks: [9, 10, 11, 12]
  },
  {
    id: "m4",
    number: 4,
    title: "Fused Kernels, Reading Real Code, JAX, and Capstone",
    range: "Weeks 13–16",
    weeks: [13, 14, 15, 16]
  }
];

// post: null until published, then { url: "...", date: "YYYY-MM-DD" }
const WEEKS = [
  {
    n: 1,
    track: "image",
    title: "Image Strides & Memory Layout",
    study: "`.strides`, C-contig vs F-contig, views vs copies, why conv layers want CHW.",
    project: "Benchmark `arr[::2]` vs `np.ascontiguousarray(arr[::2])`; visualize strides across transpose/reshape/slice on an RGBA image.",
    post: null,
    postTitle: "What a 4-channel image taught me about memory"
  },
  {
    n: 2,
    track: "audio",
    title: "Audio as a 1D Signal: Sampling, Quantization, Layout",
    study: "Nyquist theorem, bit depth (int16 PCM vs float32), WAV header structure, mono/stereo interleaving.",
    project: "Record a 30s bass clip, manually parse the WAV header with `struct`, convert int16→float32 by hand, verify against `librosa.load`.",
    post: null,
    postTitle: "A bass note is just a very long contiguous array — until it isn't"
  },
  {
    n: 3,
    track: "systems",
    title: "Broadcasting Internals (cross-domain)",
    study: "Broadcasting rules, when NumPy allocates vs reuses memory.",
    project: "One image example (per-channel normalization of a batch) and one audio example (per-frame normalization of stereo channels) — show where each silently forces a copy.",
    post: null,
    postTitle: "Broadcasting isn't free: the hidden cost, in two domains"
  },
  {
    n: 4,
    track: "image",
    title: "im2col & Convolution as Matmul",
    study: "How 2D convolution reduces to matmul via im2col.",
    project: "Implement `im2col` from scratch, do a 2D convolution as matmul, compare to naive loop convolution.",
    post: null,
    postTitle: "Convolution is just matmul in disguise"
  },
  {
    n: 5,
    track: "systems",
    title: "Cache-Aware Tiled Matmul (CPU baseline)",
    study: "L1/L2 cache hierarchy, why tiling reduces cache misses, roofline model basics.",
    project: "Naive matmul vs blocked/tiled matmul in pure NumPy; benchmark across tile sizes.",
    post: null,
    postTitle: "Tiling my way to a faster matmul"
  },
  {
    n: 6,
    track: "systems",
    title: "Raw CUDA: the Same Tiled Matmul on GPU",
    study: "CUDA thread/block/grid model, shared memory, bank conflicts, occupancy; set up `nvcc`.",
    project: "Port the Week 5 tiled matmul to raw CUDA C, naive first, then shared-memory tiled. Profile both with Nsight Compute and report achieved memory bandwidth and occupancy, not just runtime. Compare against cuBLAS/`torch.matmul`.",
    note: "This is where “tiling helps because of cache reuse” becomes concrete in hardware terms: shared memory as a programmer-managed cache, occupancy as the GPU-specific cost of using too much of it.",
    post: null,
    postTitle: "My tiled matmul, now on the GPU — and what Nsight Compute showed me"
  },
  {
    n: 7,
    track: "audio",
    title: "STFT via Strides + FFT Internals",
    study: "STFT framing and windowing (Hann/Hamming, spectral leakage); Cooley–Tukey FFT recursion, O(n log n) vs naive DFT's O(n²).",
    project: "Build overlapping frames with `as_strided` (no copy), apply a Hann window, implement a recursive radix-2 Cooley–Tukey FFT from scratch. Benchmark against `np.fft.fft` and plot the complexity gap. Assemble a manual spectrogram vs `librosa.stft`.",
    post: null,
    postTitle: "STFT is im2col for sound, and here's the FFT that makes it fast"
  },
  {
    n: 8,
    track: "audio",
    title: "Mel Spectrograms as a Matmul",
    study: "Mel filterbank construction, why a mel spectrogram is `power_spectrum @ filterbank_matrix`.",
    project: "Build a mel filterbank by hand, compute the mel spectrogram as one matmul, validate with `torch.allclose` against `librosa.feature.melspectrogram`. Redo in fp16/bf16 and report the numerical error introduced.",
    note: "Standing habit starts here: every notebook from this week on validates against a reference, and every GPU benchmark from Week 6 on reports a profiler-derived number, not just wall-clock time.",
    post: null,
    postTitle: "Mel spectrograms are a matmul — and precision matters more than you'd think"
  },
  {
    n: 9,
    track: "systems",
    title: "Custom Autograd Functions + Mixed Precision",
    study: "`torch.autograd.Function`, manual forward/backward derivation; why LayerNorm/Softmax are numerically tricky in fp16 (overflow in variance/exp).",
    project: "Reimplement LayerNorm manually with custom backward; run in fp32 and fp16, compare to `torch.nn.LayerNorm` outputs and gradients in both precisions.",
    post: null,
    postTitle: "Writing my own LayerNorm — and where fp16 breaks it"
  },
  {
    n: 10,
    track: "audio",
    title: "Conv1D on Raw Waveform + Bandwidth Profiling",
    study: "`nn.Conv1d` layout `[batch, channels, length]`; memory-bandwidth-bound vs compute-bound ops.",
    project: "Build a small Conv1d stack on the raw bass waveform, profile with `torch.profiler` and report achieved bandwidth vs the GPU's peak bandwidth for that op.",
    post: null,
    postTitle: "Is my Conv1d compute-bound or memory-bound? What the profiler says"
  },
  {
    n: 11,
    track: "systems",
    title: "Memory Format & Nsight Systems Trace",
    study: "`channels_last` vs `channels_first`.",
    project: "Benchmark a small CNN in both formats; capture an Nsight Systems timeline trace of both runs and compare kernel launch patterns and gaps.",
    post: null,
    postTitle: "channels_last under the profiler: what's actually different on the timeline"
  },
  {
    n: 12,
    track: "systems",
    title: "Intro to Triton: Fused Elementwise Kernel",
    study: "Triton's grid/block/pointer/mask model.",
    project: "Write a fused bias+GELU Triton kernel, validate with `allclose` against unfused PyTorch, time with `torch.cuda.Event`.",
    post: null,
    postTitle: "My first Triton kernel: fusing bias + GELU"
  },
  {
    n: 13,
    track: "audio",
    title: "Triton for Audio: Fused Windowing + Normalization",
    study: "Shared memory and coalesced access in Triton.",
    project: "Fuse Hann-windowing and per-frame normalization from Week 7 into a single Triton kernel, benchmark and validate against the separate NumPy ops.",
    post: null,
    postTitle: "Fusing DSP ops in Triton: one pass instead of three"
  },
  {
    n: 14,
    track: "systems",
    title: "Reading Real Production Kernels",
    study: "Pick one real, widely-used kernel — FlashAttention's CUDA source, or a PyTorch ATen kernel (softmax / layer_norm) — and read it closely.",
    project: "Annotate the source in your own words, respecting the license. Explain what tricks it uses that the toy Week 12/13 kernels didn't: warp-level primitives, vectorized loads, register blocking, online softmax. Write a short comparison table.",
    note: "Deliberately not a from-scratch week — reverse-engineering real code is a distinct skill from building toy versions.",
    post: null,
    postTitle: "Reading FlashAttention's CUDA source after building my own toy version"
  },
  {
    n: 15,
    track: "systems",
    title: "JAX: JIT/XLA Fusion + vmap Batching + Pallas Port",
    study: "`jax.jit` tracing and XLA HLO; `vmap` as compiled batching, not a loop; JAX Pallas basics.",
    project: "Write the Week 8 mel-spectrogram matmul in JAX, inspect HLO before/after `jit`; use `vmap` to batch the Week 7 STFT framing; port the Week 13 Triton kernel to Pallas and compare.",
    post: null,
    postTitle: "jit, vmap, and Pallas: three JAX ideas, one afternoon"
  },
  {
    n: 16,
    track: "systems",
    title: "Capstone: Efficient Attention Over Spectrogram Frames",
    study: "FlashAttention's tiling + online softmax trick, now informed by Week 14's source-reading.",
    project: "Implement a simplified tiled attention forward pass over mel-spectrogram frames, without materializing the full attention matrix. Validate against naive attention, benchmark memory savings, test fp16 vs fp32 stability.",
    note: "Repo milestone: a README tying all 16 posts into one narrative — image and audio as two case studies of the same underlying principles.",
    post: null,
    postTitle: "Building mini-FlashAttention over sound: the whole roadmap in one kernel",
    capstone: true
  }
];

const READING_LIST = [
  "\u201cWhat Every Programmer Should Know About Memory\u201d — Ulrich Drepper",
  "CUDA C Programming Guide: memory coalescing, shared memory, occupancy",
  "Horace He, \u201cMaking Deep Learning Go Brrrr\u201d",
  "A DSP intro on Nyquist and windowing functions (footing for Weeks 7–8)",
  "NVIDIA Nsight Compute / Nsight Systems docs — used from Week 6 onward"
];

const RESEARCH_IDENTITIES = ["Vision", "LLM + NLP Systems", "ML Systems + Efficiency"];
