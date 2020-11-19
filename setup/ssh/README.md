To set up SSH for github access, use the following commands (change the email address):

```
ssh-keygen -t ed25519 -C "your_email@example.com"
cat ~/.ssh/ssh_ed25519.pub
```

Copy the contents of the file to Github under your user account. Now `git clone` will work.
