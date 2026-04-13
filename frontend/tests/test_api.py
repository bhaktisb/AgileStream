import requests

def test_post_bug():
    data = {
        "title": "Login Issue",
        "description": "Cannot login with valid credentials.",
        "priority": "High"
    }
    res = requests.post("http://localhost:5000/api/bugs", json=data)
    assert res.status_code == 201

def test_get_bugs():
    res = requests.get("http://localhost:5000/api/bugs")
    assert res.status_code == 200
    assert isinstance(res.json(), list)
