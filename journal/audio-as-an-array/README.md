### ***Audio is an array too?***
---

At college, I used to be a part of the music society. I was a vocalist and had many cool performances and backstage memories during my time there. When I used to study and do projects for ML/AI engineering a few months back, I tried to choose subjects of interests from my real-life.

Once, during one such time when I decided to work on an audio classification project, I noticed a very peculiar thing - bass guitar was missing from almost every dataset I ever found. This had me curious, if there was any specific reason for this seemingly structured absence? Turns out, there was. 

The bass guitar is consistently underrepresented relative to its acoustic footprint, and I came across a few compounding reasons for that:

- **Recording pipelines actively cut it**: High-pass filters (also called *low-cut* or *bass-cut filters*) are standard practices for discarding the frequencies below a cutoff point (default, 75-150Hz -> which is exactly where a bass guitar's fundamental lives).
- **Isolated bass is rare by nature**: A lot of instruments dataset is scraped from mixed recordings. Bass almost never exists as a solo, clean signal - rather sits underneath everything else in the mix.Getting a clean, isolated, labeled bass clip requires either a separate recording or source separation, both far less common than acoustic covers. On top of that, several papers on instrument classification explicitly note that classes get dropped or shrunk when they lack sufficient clean samples.
So even before it can get to modeling, the signal has already been filtered out twice: once by the recording chain, once by the dataset curation process.

---

Now this was a sign that I had to see what's so special or difficult about these low frequencies? 

Before that, let me familiarize you a bit, with the audio data.


---


---
***The lesson I learned:***



*Apart from that, I also found out that:*

    It's not that low frequencies are acoustically special - it's that the entire ML audio toolchain (recording, filtering, featurization, perception-inspired scales) was optimized for speech and mid-range instruments, and bass falls into essentially every gap that leaves behind.

***Until next time...***