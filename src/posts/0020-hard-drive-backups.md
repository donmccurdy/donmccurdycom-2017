---
title: Hard drive backups
slug: hard-drive-backups
date: 2019-05-18 11:32:00
layout: post.html
---

I recently changed how I'm storing personal files and backing up my computer. As background, I use an older 2012 Apple laptop with a 500GB SSD, and that hard drive has been ~90% full for a while. I've been backing it up to an external HDD in my apartment, which is insurance against a hard drive failure but not against a fire, in which case both physical devices are gone. While Apple Time Machine can provide automatic backups, I do them manually – the HDD is loud, my apartment is small, and the noise is enough to keep me awake.

With the new backup plan I had three goals:

1. Backups should be automatic and silent.
2. Backups should be replicated in the cloud.
3. Larger files (RAW photos, music) should move off my laptop to free up space, but should still be backed up.

I bought an internal SSD and separate enclosure. This works out a little cheaper than buying an external SSD, and it's dead simple to assemble the two. If you don't care about noise, a 2TB 3.5" HDD (currently $65) would be much cheaper, or you could get a larger drive.

- [Western Digital Blue SSD (2TB)](https://www.newegg.com/western-digital-blue-2tb/p/N82E16820250089) – $220
- [ORICO 2.5" Enclosure](https://www.newegg.com/orico-2588us3-bk-enclosure/p/0VN-0003-000H1) – $15

I partitioned the drive (0.8TB for Time Machine, 1.2TB for media). Including my laptop's drive, that's three volumes:

- Primary – laptop SSD (0.5TB)
- Time Machine – external SSD (0.8TB)
- Media – external SSD (1.2TB)

For cloud backups, I'm using [Backblaze](https://www.backblaze.com/) and paying $6/month for unlimited storage. The primary drive is backed up to the external SSD and Backblaze. Media on the external SSD is backed up only to Backblaze. Both happen automatically. The idea of self-hosting backups on Google Cloud Storage or S3 was tempting, but no.

My laptop has plenty of free space again, and it's nice having my Lightroom photo library on a separate drive with enough storage for future needs. And of course, backups are no longer dependent on my physical apartment.

***

<small>
A few alternatives:

- Use an HDD instead of an SSD. Cheaper and more storage, but noisy and physically larger.
- Back up exclusively to Backblaze or another online provider, and skip the external drive.
- Back up to a rotating pair of external drives, keep one drive in a safe deposit box, and skip the online provider. This option has no monthly cost, but requires good habits about backing up and rotating the drives.
- Adobe Lightroom offers 1TB photo storage with its $10/month plan, which isn't that much more than $6/month for Backblaze. If I cared more about online access to my photos, or were already paying an Adobe subscription, that option might be tempting.
<small>
