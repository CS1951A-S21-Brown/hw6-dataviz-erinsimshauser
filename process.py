import pandas as pd
import numpy as np
from itertools import combinations


def genres():
    df = pd.read_csv('data/netflix.csv')

    df2 = pd.DataFrame(df.listed_in.str.split(
        ', ').tolist(), index=df.show_id).stack()
    df2 = df2.reset_index([0, 'show_id'])
    df2.columns = ['show_id', 'genre']
    df2 = df2.groupby(['genre'])["show_id"].count().reset_index(name="count")
    # print(df2)
    df2.to_csv('data/genre.csv', index=False)


# Your boss wants to know the number of titles per genre on Netflix.
# csv of genre, num_titles
# Your boss wants to understand the average runtime of movies by release year.
def runtime():
    df = pd.read_csv('data/netflix.csv')

    df3 = df[df['type'] == 'Movie']
    #df3['duration'] = df3['duration'].str.split(' min').astype(int).tolist()
    df3["duration"] = pd.to_numeric(df3["duration"].str.replace(' min', ''))
    df3 = df3.groupby(['release_year'])['duration'].mean().astype(
        int).reset_index(name="avg")
    print(df3)
    df3.to_csv('data/duration.csv', index=False)


def actors():
    df4 = pd.read_csv('data/netflix.csv')
    df4 = df4[df4['type'] == 'Movie']

    l = df4['cast'].str.split(', ').tolist()
    df = pd.DataFrame(df4["show_id"])
    df['cast'] = l
    a = pd.DataFrame(df.explode('cast'))

    df = df[df['cast'].notna()]
    # df.drop(df['show_id'])
    # df.dropna()
    #print(a)
    a.columns =['id', "cast"]
    a['count'] = 1

    a = a.groupby(['cast'])['count'].sum().reset_index(name="count")
    print(a)

    df['cast'] = df['cast'].apply(lambda x: list(combinations(x, 2)))
    df2 = pd.DataFrame(df.explode('cast'))

    df2 = df2[df2['cast'].notna()]
    df2['count'] = 1
    df2.columns = ['show_id', 'cast', 'count']

    df2 = df2.groupby(['cast'])['count'].sum().reset_index(name="count")

    df2 = df2[df2['count'] > 4]
    c = df2['count'].tolist()

    df2 = df2.drop(columns=['count'])
    df2.index = range(len(df2.index))

    #print(df2)

    # print(df2)
    #df3 = pd.DataFrame(df['cast'].tolist(), index=df.index)

    df2[['source', 'target']] = pd.DataFrame(df2['cast'].tolist(), index=df2.index)
    df2 = df2.drop(columns=['cast'])
    df2['count'] = c
    df2['count'] = df2['count'].apply(lambda x: str(x))
    df2.to_csv('data/actorpairs.csv', index=False)

    #print(df2)
    #df3[['source', 'target']] = pd.DataFrame(df3.cast.tolist(), index=df3.index)
    #print(list(combinations(df['cast'], 2)))
    #df3.drop(columns=['cast'], inplace=True)

    #df4 = list(combinations(df4['cast'], 2))

    # print(df3)


def main():
    actors()


if __name__ == "__main__":
    main()
