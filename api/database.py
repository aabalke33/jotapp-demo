# import os
import pandas as pd
# from sqlalchemy import create_engine, text, Column, Integer, String
# from sqlalchemy.orm import Session, declarative_base
from .demo_queries import query_one, query_two, query_three


# db_ssl = {"ssl": {"ssl_ca": "/etc/ssl/cert.pem"}}

# engine_read = create_engine(os.environ['DB_CONNECTION'], connect_args=db_ssl)
# engine_write = create_engine(os.environ['DB_CONNECTION2'], connect_args=db_ssl)
# Base = declarative_base()


def query_login(email, password):
    #
    # salt = os.environ['SALT']
    #
    # with engine_read.connect() as conn:
    #     query = conn.execute(
    #         text(f"SELECT email, first_name, last_name, user_id FROM users WHERE email = \"{email}\" "
    #              f"AND pass = sha2(\"{salt + password}\", 256)"))
    #
    #     response = dict()
    #
    #     for i, row in enumerate(query):
    #         response[i] = {
    #             'email': row[0],
    #             'first_name': row[1],
    #             'last_name': row[2],
    #             'user_id': row[3]
    #         }

    # FOR DEMO SQL DATABASE IS DISCONNECTED AND QUERY RETURN IS HARD CODED

    if email == "user@jotappdemo.app" and password == "demoPassword-123":
        return {
            'email': "user@jotappdemo.app",
            'first_name': "User",
            'last_name': "User",
            'user_id': 1
        }
    else:
        return None


def query_notes(user_id):
    big_dict = {0: 'Basic Note', 1: 'Intake Report', 2: 'Couples Therapy Note'}

    return big_dict


def query_all(note_id):
    # with engine_read.connect() as conn:
    #     query = conn.execute(
    #         text(f"SELECT DISTINCT categories.category_id, categories.category_name, subcategories.subcategory_id, "
    #              f"subcategories.subcategory_name, subcategories.subcategory_type, snippet_front, statement_id, "
    #              f"statement_text "
    #              f"FROM statements "
    #              f"INNER JOIN subcategories ON statements.subcategory_id = subcategories.subcategory_id "
    #              f"LEFT JOIN snippets ON subcategories.subcategory_id = snippets.subcategory_id "
    #              f"INNER JOIN categories ON subcategories.category_id = categories.category_id "
    #              f"WHERE note_id = {note_id} "
    #              f"ORDER BY category_id, subcategory_id, statement_id"))
    #
    #     response = dict()
    #
    #     for i, row in enumerate(query):
    #         response[i] = {
    #             'category_id': row[0],
    #             'category_name': row[1],
    #             'subcategory_id': row[2],
    #             'subcategory_name': row[3],
    #             'subcategory_type': row[4],
    #             'snippet_name': row[5],
    #             'statement_id': row[6],
    #             'statement_text': row[7]
    #         }
    #
    #     return response

    # FOR DEMO SQL DATABASE IS DISCONNECTED AND QUERY RETURN IS HARD CODED

    if note_id == 1:
        return query_one
    elif note_id == 2:
        return query_two
    elif note_id == 3:
        return query_three
    else:
        return  query_one



def query_note_data(note):
    response = query_all(note['note_id'])

    df = pd.DataFrame.from_dict(response, orient='index')
    df = df.astype(str)
    unique_category_ids = df['category_id'].unique()
    unique_category_names = df['category_name'].unique()

    data = dict()

    for i, category_id in enumerate(unique_category_ids):
        category_data = create_category_record(category_id, df)

        data[category_id] = {
            'name': unique_category_names[i],
            'subcategories': category_data
        }

    return data


def create_category_record(category_id, df):
    category_records = df.loc[df['category_id'] == category_id]
    unique_subcategory_ids = category_records['subcategory_id'].unique()
    unique_subcategory_names = category_records['subcategory_name'].unique()
    snippet_index = category_records.reset_index().groupby(['subcategory_id'])['snippet_name'].min().to_list()
    type_index = category_records.reset_index().groupby(['subcategory_id'])['subcategory_type'].min().to_list()

    category_data = dict()

    for i, subcategory_id in enumerate(unique_subcategory_ids):
        snippet, statements, subcategory_type = create_subcategory_record(
            df, i, snippet_index, type_index, subcategory_id)

        category_data[subcategory_id] = {
            'name': unique_subcategory_names[i],
            'type': subcategory_type,
            'snippets': snippet,
            'statements': statements
        }
    return category_data


def create_subcategory_record(df, i, snippet_index, type_index, subcategory_id):
    subcategory_records = df.loc[df['subcategory_id'] == subcategory_id]
    unique_statement_ids = subcategory_records['statement_id'].unique()
    statement_index = subcategory_records.reset_index().groupby(['statement_id'])['statement_text'].min().to_list()
    statements = dict()

    subcategory_type = type_index[i]

    snippet = []
    if snippet_index[i] and snippet_index[i] != "None":
        snippet = [snippet_index[i]]

    for j, statement in enumerate(statement_index):
        statement_id = unique_statement_ids[j]
        statements[statement_id] = statement

    return snippet, statements, subcategory_type


def add_statement(statement_text, subcategory_id):

    # FOR DEMO SQL DATABASE IS DISCONNECTED AND QUERY RETURN IS HARD CODED

    what_to_do = None

#     chars = ["(", ")", "{", "}", "[", "]", "|", "`", "¬", "¦", "!", " ", "\"", "£",
#              "<", ">", ":", ";", "#", "~", "_", "-", "+", "=", ",", "\'"]
#     bad_chars = [e for e in chars if e in statement_text]
#
#     if len(bad_chars) <= 1:
#         with engine_write.connect() as conn:
#             with Session(bind=conn) as session:
#                 session.add(Statement(statement_text=statement_text, subcategory_id=subcategory_id))
#                 session.commit()
#
#
# class Statement(Base):
#     __tablename__ = 'statements'
#     statement_id = Column(Integer, primary_key=True)
#     statement_text = Column(String(512))
#     subcategory_id = Column(Integer)
