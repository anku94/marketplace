marketplace
===========

This website is gonna use some CSS, some JS, some jQuery, and of course, HTML.

Since I doubt if anyone but me and partner (Hello, Nehal!) is gonna go through this, I am just going to list the work that needs to be done here.

June 2, 1:58AM, Ankush
-----------------------
Moved the code to experiment.html with the changed stylesheet. Removed almost all the javascript code at the bottom that previously handled resizing. The footer-div now comes before the content-div, due to the requirements of the CSS layout. The only bug other than the carousel height is the initial position of the image. The image is not centered initially. Although when you visit the same image again, it gets centered.

index.html is now basically useless - index2.html will be removed and experiment.html will be made into index.html once the bugs that are present in experiment.html and not in index2.html are removed.

Also, __necessary modifications to the latest jquery version need to be made so that the scroll functionality can be regained. Or, a better method to make the scroll wheel work needs to be figured out, as the current method does not work in Chrome anyway.__

May 28, 1:05PM, Nehal
------------------------
Changes made and can be seen in index2.html. 16 Transitions have been added and linked with elements in right-sidebar. Loop-problem, Resize-problemyet to be resolved. A little css work on font and other needs to be done. 

May 27, 5:35AM, Ankush
------------------------
The slides have been implemented and they kindda work. The carousel is still to be added.

The centering problem has been solved, although it has not been tested with images of various sizes. (A for loop with that function run for every image upon initialization might solve an issue).

The clipping problem is still there - if the image is wider or taller than the screen, it will clip. Some more code is required to adjust that.

Other than that, only the carousel is left. The resizable footer is a minor job once the graphics are ready, which, again, is a minor job using the .animate function.

The font style on the navbar needs to be improved. This one practically sucks.



May 26, 1:46AM, Ankush
-------------------------
All the stuff in the directories is empty/fake/not required. All the code is in the index.html and both image files required are in the root.

First, all the stuff has to be organized. The CSS is entirely in the index.html, and needs to be moved to its own style sheet. The images have to be moved to their own folder.

The CSS is, I hope, generic and can be used for future web pages. The nav-sprites will be different for different pages so maybe we need to rename them appropriately.

There is some jQuery code at the bottom which calculates the dimensions of the window and sets the dimensions of the divs accordingly.

There are MAJOR compatibility issues with IE9 even now, despite the fact that there is absolutely nothing here, besides the layout.

We could - either not bother about those, or bother about those. Which would take some time.

There is another jQuery library, called jQuery UI. It has addClass and removeClass buttons which are, by default, animated. Those in jQuery are not, I guess. Those would be handy. Plus, we could take a look at the pre-existing widgets and stuff.

Nehal, please follow this format and update the README after every change. The latest update goes on top, so we do not have to scroll to the bottom everytime.

Let us get this done. Cheers.
