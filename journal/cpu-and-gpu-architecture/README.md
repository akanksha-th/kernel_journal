###**How different CPUs and GPUs are, structurally?**
---

Let's start from the start. Remember studying for the subject COA - Computer Organization and Architecture. Remember being taught how developing a clear distinction is the most crucial step? If not, now you know that it is!
A *computer architecture* defines the (high-level) internal design of a computer. It describes the "idea" - the logic, instruction set, addressing modes, data types, cache optimization etc. This is the part visible to a programmer - programmers need to know instruction sets and data sizes to write code.
While a *computer organization* defines the low-level implementation of actual features - *the implementation of the architecture*. It consists of physical components of a computer, like circuit design, adders, peripherals, memory organization etc. This part is hidden from the programmer - internal circuit designs and control signals operate behind the scenes.

So, now as the distinction is clear (I hope) - CPUs and GPUs differ at both levels. They're built on different architectures (different execution models - will get to it, in a while), and because of that, they end up organized completely differently in the chip (cache sizes, ALU counts, control logic). The organizational differences aren't random — they're a consequence of the architectural choice. Architecture is the cause, organization is the effect.

I'm pretty sure I just confused you, so here's an analogy. (Read carefully or I might confuse you even more)
Imagine an F1 car and a bullet train - to say that these two are two different architectures doesn't make any sense, because technically, they both use mechanical engineering, engines, and wheels. They are different indeed, but their architectures fairly revolve around the same logic of "engine converts energy and wheels convert that into motion". What's different is how that logic gets implemented i.e. engine size, wheel count, track vs. road, top speed, acceleration profile. That's a difference in organization, not architecture. Same blueprint, different build.

CPUs and GPUs are **not** that. It's tempting to think of a GPU as "just a CPU with way more, way smaller cores",  but that's the wrong mental model. A GPU doesn't just organize its chip differently, it runs on a different execution model altogether. A CPU core has its own control unit reading its own independent instruction stream (SISD/MIMD territory). A GPU shares one control unit across dozens of ALU lanes, all forced to execute the same instruction at the same time (SIMD/SIMT territory). 

Not to confuse you any further, if you look up Flynn's taxonomy - it is a simple foundational reference in understanding computer architectures, classified on the basis of instruction and data streams. It classifies computer architectures into 4 types - SISD (Single Instruction, Single Data - traditional Von Neumann CPU), MIMD (Multiple Instruction, Multiple Data - modern multiprocessor/ multi-core architectures), SIMD (Single Instruction, Multiple Data - GPUs) and MISD (Multiple instructions, Single Data - rare, mostly theoretical/fault-tolerant systems). SIMT (Single Instruction, Multiple Threads - GPUs) is not one of Flynn's original four. It's a term NVIDIA introduced to describe how GPUs extend SIMD with per-thread state and predication.

So the honest answer is: CPUs and GPUs differ at both levels. A single CPU core executing scalar code is SISD; a multi-core CPU running independent threads is closer to MIMD overall. CPUs focus on executing completely independent, complex streams of instructions. Whereas, GPUs are built on SIMD or SIMT - focusing on broadcasting one single instruction to thousands of data points at once. Worth acknowledging that CPUs also do SIMD (AVX/SSE vector units).

---

Now, let's dive deep into their differences:
One of the first statements that books and blogs will throw at you, when you're trying to understand the difference between them is that : "CPUs have a latency-oriented design and GPUs have a throughput-oriented one". This one statement explains everything architecturally, believe me or not. Latency is how quickly can a single task finishes and throughput is how many tasks complete in a given time. Everything architectural follows from which of the two you optimize for.

CPUs, as we all know run processes sequentially. Nothing "actually" works in parallel, it's the time-sharing illusion, what the OS does when there are more processes than cores. A CPU is built to make one thread as fast as possible. On a CPU chip, there exist a small number of powerful ALUs, big caches and a sophisticated control logic (branch prediction, out-of-order execution etc). As for multi-core architectures, this chip design is repeated.
GPUs actually run processes in parallel. A GPU gives up on making any single thread fast. It uses simple, slow cores with small caches, and one control unit is shared across many ALUs - that saves so much area that thousands of ALUs fit on the chip. 

Memory latency, which a CPU hides with cache, a GPU hides by keeping thousands of threads in flight and switching to a ready one whenever another stalls. The trade-off is that a GPU is only fast when there's a huge amount of independent, similar work to do. A CPU is better when the work is sequential, branchy, or small.

---
Well, here's one really problematic thing that can confuse us, so it's better to clear it up right now - there exist some words, used in context of both the architectures, but mean completely different things for each.

1. "**THREADS**"    
    We all know what threads are in a CPU - OS threads (software, scheduled by the OS, context-switched onto cores). The OS decides how many of those exist and how they're time-sliced. But GPU "threads" in the CUDA/architecture sense are a hardware construct: an SM (Streaming Multiprocessor - the GPU's equivalent of a "core cluster") has a fixed number of ALU lanes (commonly 32) wired to execute together as a *warp*. That grouping of 32 is baked into the chip itself, not decided by an OS. GPUs don't run an OS-style scheduler over their threads the way a CPU does over processes.

`What is a warp? - It is not a software concept that we request. It's how the hardware physically wires threads to a shared instruction stream.`
NVIDIA hardware groups 32 threads together into a warp, and the SM's control unit issues one instruction at a time to all 32 lanes at once. Each lane runs that same instruction on its own private data (its own registers, its own array index). Though all the threads in a warp don't have independent program counters. There is one program counter for the whole warp.
When we launch a kernel with, let's say, 256 threads per block, the hardware silently splits them into 8 warps of 32 and schedules those warps onto the SM's lanes. 

2. "**CORE**"    
    **CUDA core != CPU core**
    NVIDIA markets each ALU lane as a "CUDA core". Seeing "10000 CUDA cores" on a specification sheet, the instinct we have (being a CPU user, most of our lives) is to compare it directly to CPU's "8 cores" - making us think, "Damn, this GPU has 1250x the cores". Well, in reality, it doesn't. 
    A CUDA core is just one ALU lane - no independent control unit, no independent program counter, no branch predictor, nothing. It's just a group of workers, not the thing deciding what to do. A CPU core is a complete, autonomous unit - fetch, decode, execute, its own cache. 
    So, multiple CPU cores are essentially like different technical societies in our college - they all have their own decider and workers, and they all can and do function independently at all times. A GPU, on the other hand, is more like a lecture hall (the SM) with one professor as the decider (the control unit) and a few dozen students as workers (the CUDA cores).

3. "**CACHE**"
    CPU cache is entirely hardware-managed, invisible to the programmer. But, a GPU's fast on-chip memory (shared memory) is programmer-managed. We, as programmers decide what goes in and what goes out.

4. "**KERNEL**"
    In CUDA, a "kernel" is just a function we launch on the GPU. It has nothing to do with OS kernel. 
    Early on, this gave me the biggest trip.

More of such "words" that are not covered here, let's tackle them in future, as we keep coming across them.

---

To visualize this difference better and its importance, let's take a case:

    We now know that GPU ALUs share a control unit. So, what problem does that create when threads in the same group need to take different branches of an if/else? And interestingly, a CPU does not have this problem.
    Imagine the code is, as follows:

        if (n % 2 == 0) {
            A();
        } else {
            B();
        }

Let's find out why. 
My careless first instinct was to think about OS-style concurrency problems like race conditions, critical sections, locks. But, well, *wrong*. A race condition happens when multiple threads fight over shared, mutable data. But here the problem is purely about instruction issue, not data access. The one GPU constraint to pay attention to is that the hardware can only fetch and broadcast one instruction per cycle, and that one instruction has to go to all 32 lanes.

My second instinct was that maybe they just don't execute line by line - of course this is wrong - lines of codes are always executed line by line by every architecture, no exceptions.

Its important to understand what the question means: Say we launch 100 threads (so ~4 warps of 32, roughly), and each thread `i` tests its own value `n = i`. The condition `n % 2 == 0` gets evaluated per-thread, using each thread's own data (GPUs parallelization) - 100 different values tested simultaneously, one per lane.

So within a single warp: threads holding even values (2, 4, 6, 8...) evaluate the condition true, threads holding odd values (1, 3, 5, 7...) evaluate false. When A() is issued, the even-value lanes are active and the odd-value lanes are masked off. When B() is issued, the mask flips i.e. odds go active, evens go idle.

Finally no more (utterly wrong) instincts left, and it's time for the concept. Let me put this in an execution sequence:

    1. The warp is issued the instructions for `A()` - i.e. every lane receives them but each lane carries a `1-bit active mask`. Lanes where the condition was false get masked inactive - they receive the instruction but it's a no-op for them.
    2. The warp is then issued the instructions for `B()`. The mask flips: `A()` lanes go inactive then `B()` lanes activate and execute.
    3. Once both paths finish, all 32 lanes reconverge and go back to executing in lockstep.

`Lockstep just means "moving in exact unison, one step at a time, together"`
This is called `warp divergence`. The warp pays for the time of both branches, added together. If `A()` takes `x` cycles and `B()` takes `y` cycles, the warp spends `x+y` cycles total - with half its lanes sitting idle through each half.
And this is also why branchy, data-dependent code quietly wrecks GPU performance. A CPU is built for such problems - each thread has its own program counter and just goes its own way. A GPU pays real, measurable cycles every time a warp disagrees with itself.

This is important to note that this example shows the *worst-case pattern* for divergence. Since even/odd alternates lane-by-lane, every single warp in the whole grid will have close to a 50/50 split, so every warp pays the full cost of both branches. But for some other lenient conditions, warps may not diverge at all. For them, mostly, only the one warp straddling the boundary pays the cost.

---
***The lesson I learned...***

    CPUs and GPUs are as similar as they're different. They have same building blocks - ALUs, control units, registers, caches - but they have their differences too.
    The real trap isn't necessarily the big differences, but I've realized it's maybe just the small words that quietly mean something else when the context of the architecture is changed. "Threads" did give me a whole trip - hopefully I saved you from it. "Core", "cache" and "kernel" also cause some confusions. 
    To learn that one architectural choice can bring so much change was indeed fun. It's the same decision that gives GPUs their throughput, and also the one that makes something as ordinary as an if/else cost double if a warp can't agree with itself.

***Until next time...***