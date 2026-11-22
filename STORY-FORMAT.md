# Verhaaltjes – story format (version 3)

Every story is **one folder**. The same folder works in two places:

* **Online (GitHub):** in the `stories/` folder of the app. Every tablet gets it the next time the app opens with wifi.
* **On the tablet:** zip the folder and add it via ⚙️ (hold 1.5 s) → **📦 Choose story pack(s)**. It's stored on that tablet only.

```
stories/
  index.json              ← the list of stories, in home-screen order
  drakie/                 ← the story's code: lowercase letters, numbers and - only
    story.json            ← REQUIRED: title, text, questions (and which files it uses)
    card.jpg              ← picture on the home screen
    1.jpg 2.jpg 3.jpg …    ← story pictures, shown one after another while she listens
    story.mp3             ← the story audio (no MP3 = the tablet's read-aloud voice)
    story.vtt             ← subtitle timing for story.mp3 (optional)
    title.mp3             ← the title, spoken when she taps 🔊 on the card (optional)
    q1.mp3                ← question 1 spoken (optional; otherwise the voice reads it)
    q1.jpg                ← picture shown with question 1 (optional)
    q1_a.jpg              ← answer pictures (optional, instead of emoji)
    q1_answer.mp3         ← full answer sentence spoken (optional)
```

Only `story.json` is required. Everything else is optional. A story with only text and emoji works fine.

## story.json

```json
{
  "format": 1,
  "id": "drakie",
  "version": 1,
  "title": "Drakie, de kleine draak.",
  "emoji": "🐉",
  "text": "Er was eens een kleine draak. Hij heette Drakie. …",
  "card": "card.jpg",
  "pictures": ["1.jpg", "2.jpg", "3.jpg"],
  "audio": "story.mp3",
  "subtitles": "story.vtt",
  "title_audio": "title.mp3",
  "questions": [
    {
      "question": "Welke kleur heeft Drakie?",
      "right": "🟢",
      "wrong": ["🔴", "🟡"],
      "say": "Drakie is groen."
    },
    {
      "question": "Wat vond Drakie in het bos?",
      "right": "q2_a.jpg",
      "wrong": ["🚗", "q2_c.jpg"],
      "picture": "q2.jpg",
      "audio": "q2.mp3",
      "say_audio": "q2_answer.mp3"
    }
  ]
}
```

| Field | What it is |
|---|---|
| `id` | The story's code. Same as the folder name. A pack with the same code replaces the old one. |
| `version` | **Raise it (2, 3 …) when you replace a picture or MP3 with one of the same name.** Tablets then download the new file. Not needed when you only change text. |
| `title` | Shown and spoken on the card. |
| `emoji` | Shown on the card when there's no `card` picture. |
| `text` | The whole story. The voice reads it when there's no MP3. **It's also the subtitles**: each sentence (ending in `.` `!` or `?`) is one subtitle line, so keep it the same as the MP3. |
| `card`, `pictures` | File names in this folder. Pictures are spread evenly over the story (6 pictures in 6 minutes = one per minute). |
| `audio`, `subtitles`, `title_audio` | File names (optional). |
| `questions` | 1 to 8. `right` = the right answer, `wrong` = exactly two wrong ones. Each answer is an **emoji or a picture file name**. `say` = full answer sentence said after she taps the right answer. `picture`, `audio`, `say_audio` = optional files. |

Tips: all text needs `"double quotes"`. There's a comma between items but not after the last one. If the app says story.json isn't valid, paste it into jsonlint.com to find the mistake.

When you add a pack on the tablet, files with the usual names (`card.jpg`, `1.jpg`, `story.mp3`, `story.vtt`, `q1.mp3`, `q1_a.jpg` …) are found even if story.json doesn't list them. **Online, list every file in story.json.** Pictures can be .jpg, .png or .webp. Audio can be .mp3 or .m4a.

## Subtitles

Subtitles are on by default, with the word being read lit up in yellow. You can switch to sentence only, or off, in ⚙️ → 💬 Subtitles.

* **Read-aloud voice:** nothing to do. Each sentence is shown while it's spoken.
* **MP3 without a timing file:** the timing is estimated from the MP3's length. Usually good enough.
* **MP3 with `story.vtt`:** exact. Three ways to make one:
  1. **On the tablet:** ⚙️ → ✏️ Edit the story → **⏱️ Time the subtitles**. Play the MP3 and tap the green button each time a sentence starts. Save, then **⬇️ Pack** to get the zip with `story.vtt` included.
  2. If the website that made your MP3 also offers subtitles (.srt or .vtt), download them and add them. Both formats work.
  3. Write it by hand:

```
WEBVTT

00:00:00.500 --> 00:00:04.000
Er was eens een kleine draak.

00:00:04.000 --> 00:00:07.500
Hij heette Drakie.
```

(Advanced: word timings like `<00:00:04.600>heette` inside a line make the highlight follow each word exactly.)

## Adding a story online (all tablets get it)

1. On GitHub, open your repository → `stories` → **Add file → Upload files** → drag the story **folder** in → Commit.
2. Open `stories/index.json` → ✏️ → add the code to the list (mind the commas) → Commit:
   ```json
   { "stories": ["frozen", "simba", "drakie"] }
   ```
3. On the tablet, with wifi: open the app. The story appears, and its files are saved for offline use. Check ⚙️ → 📚 Story library: it should say "Saved for offline use: N of N files".

To remove a story, delete its code from `index.json`. To reorder, change the order in `index.json`.

## Adding a story on the tablet only

Hold ⚙️ → **➕ New story** and fill everything in (text, pictures, MP3, questions, subtitles). Or add a ready-made pack with **📦 Choose story pack(s)**. To put it online later, tap **⬇️ Pack** on it, unzip, and follow "Adding a story online".

## Changing a library story on the tablet

✏️ Edit works on library stories too. Your changes stay on that tablet and win over the online version. To make them permanent for every tablet, tap **⬇️ Pack** and upload that folder over the old one on GitHub. Raise `version` if you replaced files.

## Asking Claude for a new story

> Write a 6-minute Flemish (nl-BE) story for a 5-year-old about [topic], as a Verhaaltjes story.json (format 1, id "[code]"): short sentences, each ending in . ! or ?, with 4 questions, each with 1 right and 2 wrong emoji answers and a full answer sentence in "say". The answers must be clearly mentioned in the story. Also list 6 picture ideas, one per part of the story, for 1.jpg to 6.jpg.
