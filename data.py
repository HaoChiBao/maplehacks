import pandas as pd

# Read Excel file
df = pd.read_excel('cleandata.csv')

# Split values in first column by comma and create new columns
df[['Column1A', 'Column1B']] = df.iloc[:, 0].str.split(',', expand=True)

df.head()
df.tail()
