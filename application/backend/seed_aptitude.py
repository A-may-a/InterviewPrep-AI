import pandas as pd

from database import SessionLocal
from models import AptitudeQuestion

CSV_FILE = "../data/aptitude_questions.csv"

def seed_questions():
    db = SessionLocal()

    try:
        # Dataset uses semicolon separator
        df = pd.read_csv(CSV_FILE, sep=";")

        # Optional: clear old data
        db.query(AptitudeQuestion).delete()
        db.commit()

        for _, row in df.iterrows():

            question = AptitudeQuestion(
                text=row["Question"],
                options={
                    "A": str(row["Option A"]),
                    "B": str(row["Option B"]),
                    "C": str(row["Option C"]),
                    "D": str(row["Option D"])
                },
                correct_answer=str(row["Answer"]).strip(),
                explanation=None,
                category="General Aptitude",
                difficulty="medium"
            )

            db.add(question)

        db.commit()

        print(f"✅ Imported {len(df)} questions successfully!")

    except Exception as e:
        db.rollback()
        print("❌ Error:", e)

    finally:
        db.close()

if __name__ == "__main__":
    seed_questions()