// Content model for the Kernel Journal site.
//
// REPO CONVENTION this site assumes:
//   /journal/<slug>/README.md   <- the actual blog post
//   /journal/<slug>/...         <- notebook, images, audio, data used in it
//
// The site never stores post text itself -> it fetches README.md straight
// from the folder and renders it. Set `published: true` once a folder
// exists and has a real README.md in it.

const GITHUB_REPO_URL = "https://github.com/akanksha-th/kernel-journal";
const WEEKS_FOLDER = "journal"; // <- change me if you rename the folder containing the weekly posts

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
    n: 1, slug: "image-strides-to-memory-layout", track: "image",
    title: "Image Strides & Memory Layout",
    postTitle: "What a 4-channel image taught me about memory",
    clueStudy: "`.strides`, C-contig vs F-contig, views vs copies, why conv layers want CHW.",
    clueProject: "Benchmark `arr[::2]` vs `np.ascontiguousarray(arr[::2])`; visualize strides across transpose/reshape/slice on an RGBA image.",
    published: false
  },
];
