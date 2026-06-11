---
title: "shelloveu — A Shell You Actually Want to Use"
date: 2026-06-11
description: "I built a Unix shell from scratch in C++17 with a file manager, text editor, image viewer, and a hidden dinosaur game. Here's how to use it."
tags: ["c++", "linux", "terminal", "open-source", "project"]
published: true
---

# shelloveu — A Shell You Actually Want to Use

What if your shell came with batteries included?

**shelloveu** is a Unix shell I wrote from scratch in C++17. Not a wrapper around bash. Not a plugin for zsh. A full shell — tokenizer, parser, pipeline executor, job control — built on GNU Readline and designed to be something you'd actually want as your daily driver.

But the shell is just the beginning. shelloveu ships with a **built-in file manager**, a **text editor**, a **sixel image viewer**, and yes — a **hidden dinosaur runner game**. All in one binary.

## The Shell

At its core, shelloveu handles everything you'd expect from a real shell:

- **Pipelines** — `cat log.txt | grep ERROR | sort | uniq -c`
- **Redirections** — `<`, `>`, `>>`, `2>`, `&>`, fd-specific forms like `2>/dev/null`
- **Background jobs** — `make -j8 &` then `jobs` to check on it
- **Tab completion**, arrow-key history, `Ctrl-C` handling
- **Structured history** — every command is logged to `~/.shelloveu/history.jsonl` with timestamps, working directory, exit code, and duration

The prompt is themeable and git-aware — it shows your current directory, branch, last exit code, and how many background jobs are running.

### Safety fuse

Run `rm -rf /` by accident? shelloveu catches dangerous `rm` patterns before they execute. Toggle it with `set safety=on` in your `~/.shelloveurc`.

## The File Manager — `fm`

Type `fm` and you drop into a **ranger-style two-pane TUI**. Directory listing on the left, live file preview on the right. Navigate with arrow keys or `hjkl` (vim-style):

| Key | Action |
|---|---|
| `j` / `k` or arrows | Move up/down |
| `l` / `Enter` | Enter directory or open file in editor |
| `h` / `Backspace` | Go to parent directory |
| `.` | Toggle hidden files |
| `~` | Jump to home |
| `q` | Quit — and **cd into whatever directory you were browsing** |

That last part is key: when you quit `fm`, your shell's working directory changes to wherever you navigated. No more `cd`-ing after you find what you're looking for.

## The Text Editor — `edit`

Type `edit myfile.txt` and you get a full-screen terminal editor in the spirit of [kilo](https://viewsourcecode.org/snaptoken/kilo/). It's not vim and it's not trying to be — it's a clean, distraction-free editor for quick edits:

- Tab-aware rendering with horizontal and vertical scrolling
- Status bar with filename, modified flag, line count, and cursor position
- `Ctrl-S` to save (prompts for a filename on new buffers)
- `Ctrl-Q` to quit (warns once if you have unsaved changes)
- Home / End / PgUp / PgDn navigation

Set `export EDITOR=edit` and the file manager will open files in it automatically.

## The Image Viewer

Browse to an image in `fm` and it renders right in your terminal. shelloveu supports two rendering backends:

- **Sixel graphics** — real pixel-resolution images with 256-color median-cut quantization, Floyd-Steinberg dithering, and run-length encoding. Works in Windows Terminal 1.22+, xterm, foot, and mlterm.
- **Half-block fallback** — uses the `▀` character with 24-bit foreground/background colors. Two pixels per cell. Works everywhere.

For JPEGs, it even parses EXIF data and shows you camera model, date taken, and exposure info. EXIF orientation is applied automatically.

## The Dinosaur Game

Type `dino` and shelloveu launches a Chrome-dinosaur-style ASCII runner. Jump cacti with `Space`, `Up`, or `W`. The game speeds up the longer you survive, and your high score is saved to `~/.shelloveu/dino_highscore`.

It's completely pointless and I love it.

## Getting Started

### Install

```bash
# Prerequisites
sudo apt update && sudo apt install -y build-essential g++ libreadline-dev

# Clone and build
git clone https://github.com/rndxdev/shelloveu.git
cd shelloveu
make
```

### Run

```bash
./shelloveu                 # interactive mode
./shelloveu -c "ls | wc -l" # single command
./shelloveu -f script.txt   # run a script
```

### Configure

Create a `~/.shelloveurc` to customize your experience:

```bash
set safety=on              # rm -rf protection
set fun_prompt=on          # playful prompt style
set prompt_symbol=>>        # change the prompt character
set banner=off             # hide the startup dino
alias ll="ls -la"
alias gs="git status"
```

### Quick tour

```bash
fm                         # launch the file manager
edit notes.txt             # open the text editor
dino                       # play the dinosaur game
hist 20                    # show last 20 commands with metadata
please                     # re-run last command with sudo
mkcd new-project           # mkdir + cd in one shot
```

## Why Build a Shell?

Because nothing teaches you how Unix works like implementing it yourself. Every pipe is a `fork` + `exec` + `dup2`. Every redirect is an `open` + file descriptor shuffle. Every background job is a process group you have to track, wait on, and report.

shelloveu started as a CS426 course project and grew into something I actually use. It's not done — glob expansion, `&&`/`||` chaining, and `fg`/`bg` are all on the roadmap — but it's already usable, and every feature is something I built because I wanted it.

Check it out on [GitHub](https://github.com/rndxdev/shelloveu) and give it a spin.
