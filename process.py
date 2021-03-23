import pandas as pd
import numpy as np


df = pd.read_csv('data/netflix.csv')

df2 = pd.DataFrame(df.listed_in.str.split(', ').tolist(), index=df.show_id).stack()
df2 = df2.reset_index([0, 'show_id'])
df2.columns = ['show_id', 'genre']
df2 = df2.groupby(['genre'])["show_id"].count().reset_index(name="count")
#print(df2)
df2.to_csv('data/genre.csv', index=False)


#Your boss wants to know the number of titles per genre on Netflix.
#csv of genre, num_titles
#Your boss wants to understand the average runtime of movies by release year.
df3 = df[df['type'] == 'Movie']
#df3['duration'] = df3['duration'].str.split(' min').astype(int).tolist()
df3["duration"] = pd.to_numeric(df3["duration"].str.replace(' min', ''))
df3 = df3.groupby(['release_year'])['duration'].mean().reset_index(name="avg")
print(df3)
df3.to_csv('data/duration.csv', index=False)
