// Content model for the Kernel Journal site.
//
// REPO CONVENTION this site assumes:
//   /weeks/<slug>/README.md   <- the actual blog post for that week
//   /weeks/<slug>/...         <- notebook, images, audio, data used in it
//
// The site never stores post text itself — it fetches README.md straight
// from the folder and renders it. Set `published: true` once a folder
// exists and has a real README.md in it.

const GITHUB_REPO_URL = "https://github.com/YOUR-USERNAME/kernel-journal"; // <- change me
const WEEKS_FOLDER = "weeks";

const TRACKS = {
  image:   { label: "Image",          icon: "aperture" },
  audio:   { label: "Audio",          icon: "wave" },
  systems: { label: "Systems / both", icon: "gear" }
};

const MONTHS = [
  {
    id: "m1",
    number: 1,
    title: "Memory Fundamentals",
    region: "The Foothills of Memory",
    range: "Weeks 1–4",
    weeks: [1, 2, 3, 4]
  },
  {
    id: "m2",
    number: 2,
    title: "Cache, Raw CUDA, and the Frequency Domain",
    region: "Cache & CUDA Caverns",
    range: "Weeks 5–8",
    weeks: [5, 6, 7, 8]
  },
  {
    id: "m3",
    number: 3,
    title: "PyTorch Internals, Precision, and Deeper Profiling",
    region: "The Precision Peaks",
    range: "Weeks 9–12",
    weeks: [9, 10, 11, 12]
  },
  {
    id: "m4",
    number: 4,
    title: "Fused Kernels, Reading Real Code, JAX, and Capstone",
    region: "The Fusion Coast",
    range: "Weeks 13–16",
    weeks: [13, 14, 15, 16]
  }
];

// clueStudy / clueProject: short teaser shown before you "dig" (fetch the README).
// published: false until the folder + README.md actually exist in the repo.
const WEEKS = [
  {
    n: 1, slug: "week-01-image-strides-memory-layout", track: "image",
    title: "Image Strides & Memory Layout",
    postTitle: "What a 4-channel image taught me about memory",
    clueStudy: "`.strides`, C-contig vs F-contig, views vs copies, why conv layers want CHW.",
    clueProject: "Benchmark `arr[::2]` vs `np.ascontiguousarray(arr[::2])`; visualize strides across transpose/reshape/slice on an RGBA image.",
    published: false
  },
  {
    n: 2, slug: "week-02-audio-sampling-quantization-layout", track: "audio",
    title: "Audio as a 1D Signal: Sampling, Quantization, Layout",
    postTitle: "A bass note is just a very long contiguous array — until it isn't",
    clueStudy: "Nyquist theorem, bit depth (int16 PCM vs float32), WAV header structure, mono/stereo interleaving.",
    clueProject: "Record a 30s bass clip, manually parse the WAV header with `struct`, convert int16→float32 by hand, verify against `librosa.load`.",
    published: false
  },
  {
    n: 3, slug: "week-03-broadcasting-internals", track: "systems",
    title: "Broadcasting Internals (cross-domain)",
    postTitle: "Broadcasting isn't free: the hidden cost, in two domains",
    clueStudy: "Broadcasting rules, when NumPy allocates vs reuses memory.",
    clueProject: "One image example (per-channel batch normalization) and one audio example (per-frame stereo normalization) — show where each silently forces a copy.",
    published: false
  },
  {
    n: 4, slug: "week-04-im2col-convolution-as-matmul", track: "image",
    title: "im2col & Convolution as Matmul",
    postTitle: "Convolution is just matmul in disguise",
    clueStudy: "How 2D convolution reduces to matmul via im2col.",
    clueProject: "Implement `im2col` from scratch, do a 2D convolution as matmul, compare to naive loop convolution.",
    published: false
  },
  {
    n: 5, slug: "week-05-cache-aware-tiled-matmul", track: "systems",
    title: "Cache-Aware Tiled Matmul (CPU baseline)",
    postTitle: "Tiling my way to a faster matmul",
    clueStudy: "L1/L2 cache hierarchy, why tiling reduces cache misses, roofline model basics.",
    clueProject: "Naive matmul vs blocked/tiled matmul in pure NumPy; benchmark across tile sizes.",
    published: false
  },
  {
    n: 6, slug: "week-06-raw-cuda-tiled-matmul", track: "systems",
    title: "Raw CUDA: the Same Tiled Matmul on GPU",
    postTitle: "My tiled matmul, now on the GPU — and what Nsight Compute showed me",
    clueStudy: "CUDA thread/block/grid model, shared memory, bank conflicts, occupancy; set up `nvcc`.",
    clueProject: "Port the Week 5 tiled matmul to raw CUDA C, naive first, then shared-memory tiled. Profile both with Nsight Compute and report achieved memory bandwidth and occupancy. Compare against cuBLAS/`torch.matmul`.",
    note: "This is where “tiling helps because of cache reuse” becomes concrete in hardware terms: shared memory as a programmer-managed cache, occupancy as the GPU-specific cost of using too much of it.",
    published: false
  },
  {
    n: 7, slug: "week-07-stft-strides-fft-internals", track: "audio",
    title: "STFT via Strides + FFT Internals",
    postTitle: "STFT is im2col for sound, and here's the FFT that makes it fast",
    clueStudy: "STFT framing and windowing (Hann/Hamming, spectral leakage); Cooley–Tukey FFT recursion, O(n log n) vs naive DFT's O(n²).",
    clueProject: "Build overlapping frames with `as_strided` (no copy), apply a Hann window, implement a recursive radix-2 Cooley–Tukey FFT. Benchmark against `np.fft.fft`, assemble a manual spectrogram vs `librosa.stft`.",
    published: false
  },
  {
    n: 8, slug: "week-08-mel-spectrograms-as-matmul", track: "audio",
    title: "Mel Spectrograms as a Matmul",
    postTitle: "Mel spectrograms are a matmul — and precision matters more than you'd think",
    clueStudy: "Mel filterbank construction, why a mel spectrogram is `power_spectrum @ filterbank_matrix`.",
    clueProject: "Build a mel filterbank by hand, compute the mel spectrogram as one matmul, validate against `librosa.feature.melspectrogram`. Redo in fp16/bf16 and report the numerical error introduced.",
    note: "Standing habit starts here: every notebook from now on validates against a reference, and every GPU benchmark from Week 6 on reports a profiler-derived number, not just wall-clock time.",
    published: false
  },
  {
    n: 9, slug: "week-09-custom-autograd-mixed-precision", track: "systems",
    title: "Custom Autograd Functions + Mixed Precision",
    postTitle: "Writing my own LayerNorm — and where fp16 breaks it",
    clueStudy: "`torch.autograd.Function`, manual forward/backward derivation; why LayerNorm/Softmax are tricky in fp16.",
    clueProject: "Reimplement LayerNorm manually with custom backward; run in fp32 and fp16, compare to `torch.nn.LayerNorm` outputs and gradients.",
    published: false
  },
  {
    n: 10, slug: "week-10-conv1d-waveform-bandwidth", track: "audio",
    title: "Conv1D on Raw Waveform + Bandwidth Profiling",
    postTitle: "Is my Conv1d compute-bound or memory-bound? What the profiler says",
    clueStudy: "`nn.Conv1d` layout `[batch, channels, length]`; memory-bandwidth-bound vs compute-bound ops.",
    clueProject: "Build a small Conv1d stack on the raw bass waveform, profile with `torch.profiler`, report achieved bandwidth vs the GPU's peak.",
    published: false
  },
  {
    n: 11, slug: "week-11-memory-format-nsight-systems", track: "systems",
    title: "Memory Format & Nsight Systems Trace",
    postTitle: "channels_last under the profiler: what's actually different on the timeline",
    clueStudy: "`channels_last` vs `channels_first`.",
    clueProject: "Benchmark a small CNN in both formats; capture an Nsight Systems trace and compare kernel launch patterns and gaps.",
    published: false
  },
  {
    n: 12, slug: "week-12-triton-fused-elementwise", track: "systems",
    title: "Intro to Triton: Fused Elementwise Kernel",
    postTitle: "My first Triton kernel: fusing bias + GELU",
    clueStudy: "Triton's grid/block/pointer/mask model.",
    clueProject: "Write a fused bias+GELU Triton kernel, validate against unfused PyTorch, time with `torch.cuda.Event`.",
    published: false
  },
  {
    n: 13, slug: "week-13-triton-audio-fused-windowing", track: "audio",
    title: "Triton for Audio: Fused Windowing + Normalization",
    postTitle: "Fusing DSP ops in Triton: one pass instead of three",
    clueStudy: "Shared memory and coalesced access in Triton.",
    clueProject: "Fuse Hann-windowing and per-frame normalization from Week 7 into a single Triton kernel, benchmark and validate.",
    published: false
  },
  {
    n: 14, slug: "week-14-reading-production-kernels", track: "systems",
    title: "Reading Real Production Kernels",
    postTitle: "Reading FlashAttention's CUDA source after building my own toy version",
    clueStudy: "Pick one real kernel — FlashAttention's CUDA source, or a PyTorch ATen kernel (softmax / layer_norm) — and read it closely.",
    clueProject: "Annotate the source in your own words. What tricks does it use that the toy Week 12/13 kernels didn't: warp-level primitives, vectorized loads, register blocking, online softmax. Comparison table.",
    note: "Deliberately not a from-scratch week — reverse-engineering real code is a distinct skill from building toy versions.",
    published: false
  },
  {
    n: 15, slug: "week-15-jax-jit-vmap-pallas", track: "systems",
    title: "JAX: JIT/XLA Fusion + vmap Batching + Pallas Port",
    postTitle: "jit, vmap, and Pallas: three JAX ideas, one afternoon",
    clueStudy: "`jax.jit` tracing and XLA HLO; `vmap` as compiled batching, not a loop; JAX Pallas basics.",
    clueProject: "Write the Week 8 mel-spectrogram matmul in JAX, inspect HLO before/after `jit`; `vmap`-batch the Week 7 STFT framing; port the Week 13 Triton kernel to Pallas.",
    published: false
  },
  {
    n: 16, slug: "week-16-capstone-attention-over-spectrograms", track: "systems",
    title: "Capstone: Efficient Attention Over Spectrogram Frames",
    postTitle: "Building mini-FlashAttention over sound: the whole roadmap in one kernel",
    clueStudy: "FlashAttention's tiling + online softmax trick, now informed by Week 14's source-reading.",
    clueProject: "Implement a simplified tiled attention forward pass over mel-spectrogram frames without materializing the full attention matrix. Validate against naive attention, benchmark memory savings, test fp16 vs fp32 stability.",
    note: "Repo milestone: a README tying all 16 posts into one narrative — image and audio as two case studies of the same underlying principles.",
    published: false,
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
