#!/bin/bash
#author: A-Lang, alang[dot]hsu[at]gmail[dot]com
# this is for debugging
#RECORD_PATH="/var/lib/asterisk/mytemp"
#
RECORD_PATH="/var/spool/asterisk/monitor/3/"
LAME="/usr/bin/lame"
cd $RECORD_PATH
#for WAV in $(ls *.wav 2> /dev/null)
#
# Ignore the audio files that are recording.
for WAV in $(ls ${RECORD_PATH}*.wav | grep -v -e "-out.wav" | grep -v -e "-in.wav" 2> /dev/null)
do
echo "Encoding MP3 file from $WAV ..."
OUT=${WAV%.*}
echo $OUT.wav
#$LAME --silent -V7 -B24 --tt $OUT.wav --add-id3v2 $OUT.wav $OUT.mp3
$LAME  -V7 -B24 --tt $OUT.wav --add-id3v2 $OUT.wav $OUT.mp3
test -r $OUT.mp3 && rm -f $OUT.wav
done
#EOF

