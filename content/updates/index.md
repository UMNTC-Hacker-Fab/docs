# Updates

```cards
Example Member | | #/updates/example-member
Leonard Jin | | #/updates/leonard-jin
```

## Create a file

**Add file → Create new file**, or the **+** next to the branch name.

![The Add file button and the + button on GitHub](img/add-file.png)

Your page: `content/updates/first-last/index.md`. Add it to the sidebar under Updates in `assets/js/nav.js`:

```js
{ title: "First Last", path: "updates/first-last", dir: true },
```

## Create a folder

Type the folder name followed by `/` in the file name box.

![Typing a folder name in GitHub's file name box](img/new-folder.png)

## Images

Put images in your `img/` folder:

```markdown
![What the image shows](img/2026-11-16-stage.jpg)
```

Set the width:

```html
<img src="img/2026-11-16-stage.jpg" width="400" alt="What the image shows">
```

Lowercase names, no spaces, under 500 KB.

## Reference

[Markdown Guide: Basic Syntax](https://www.markdownguide.org/basic-syntax/)
