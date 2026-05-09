import sqlite3
from flask import Flask, render_template, redirect, url_for, request, flash, session
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'professor_demo_key'

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row  # Enables text display instead of Row objects
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)')
    conn.execute('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, user_id INTEGER)')
    conn.commit()
    conn.close()

@app.route('/')
def index():
    if 'user_id' not in session: return redirect(url_for('login'))
    conn = get_db_connection()
    tasks = conn.execute('SELECT * FROM tasks WHERE user_id = ?', (session['user_id'],)).fetchall()
    conn.close()
    return render_template('index.html', name=session.get('username'), tasks=tasks)

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (request.form['user'],)).fetchone()
        conn.close()
        if user and check_password_hash(user['password'], request.form['pass']):
            session['user_id'] = user['id']
            session['username'] = user['username']
            return redirect(url_for('index'))
        flash('Invalid Login')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO users (username, password) VALUES (?, ?)', 
                         (request.form['user'], generate_password_hash(request.form['pass'])))
            conn.commit()
            return redirect(url_for('login'))
        except:
            # This triggers the message in the HTML above
            flash('User already exists!') 
        finally:
            conn.close()
    return render_template('register.html')

@app.route('/add', methods=['POST'])
def add():
    conn = get_db_connection()
    conn.execute('INSERT INTO tasks (content, user_id) VALUES (?, ?)', (request.form['task'], session['user_id']))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/delete/<int:id>')
def delete(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM tasks WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
    