#!/bin/bash -l

#$ -P sparkgrp       # Specify the SCC project name you want to use
#$ -l h_rt=12:00:00          # Specify the hard time limit for the job
#$ -N naacptestjob           # Give job a name
#$ -j y                      # Merge the error and output streams into a single file
#$ -m bea                     # email me
#$ -o testoutput             # output file


module load python3/3.8.10
python articles.py