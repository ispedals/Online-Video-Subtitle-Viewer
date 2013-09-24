# Online Video Subtitle Viewer

##Usage

1. Paste the embed code of some video in the textbox
2. Browse and select a JSON-formatted subtitles file which is in the form of: `{"text":'', "start":hh:mm:ss.sss, "end":hh:mm:ss.sss}, ...]`
3. Start the subtitle player by either clicking the play button, or the delay-start-by-5-seconds play button
4. Try to start the video as the subtitle clock starts
5. Keep the subtitle clock and video clock synchronized

If the subtitle clock is off, select what the current subtitle should be from the dropdown menu<

## About
This was a proof of concept to see how to display subtitles with online video. The approach that is currently implemented has many drawbacks, the biggest
of which is that the clock that is used to display the subtitles at the appropriate time is independent of the video's clock. This makes it very difficult to
keep the clocks synchronized so that the correct subtitle is displayed. This is a big problem as many videos run advertisments midway or may pause to buffer, so that one has to be on guard to stop
the subtitles and then start them again when the video starts again. I tried to address this by having a dropdown menu where one could choose the current subtitle.

The reason for this instead of using downloaded media for use with a real video player was an attempt to improve my listening skills. I had intended to use
online foreign language video that I had subtitles available for and play the video with the subtitles off the screen so that I would not depend on my reading skills
but also have the text available for quick lookup of unknown words. However, because my listening skills are very weak, anything that disturbs my concentration causes
me to lose focus. The need to fiddle with the subtitle clock and the need to recognize I am not currently understanding so that I should look at the subtitles is distracting
enough that this prevents me from focusing on the audio itself.

This could be improved by instead showing all the subtitles in a table and focusing near the vicinity of what should be the current subtitle. This means that
errors in clock synchronization will not matter as much. However, this means that all the subtitles are visible, which will make me use my reading skills instead of
listening, which was the intended goal.