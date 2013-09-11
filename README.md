waxvine
=======

waxvine creates the pathway to development nirvana

Git cheat sheet
===============

1) Open console(should be visible on the bottom, if not go to View -> Console).
2) You should see a prompt.
3) Make sure you are in waxvine directory (type "cd waxvine" if you are not).
4) Make sure you see (gh-pages), if you dont type "git checkout gh-pages".

Get the latest and greatest
===========================

If you have changes that isn't ready to be committed
    1)  git stash
    2)  git pull --rebase
    3)  git stash pop
    
If you don't have any changes
    1) git pull
    
Commit your changes
===================

1) git stash
2) git pull --rebase
3) git add .
4) git commit -m 'your comments'
5) git push origin gh-pages
