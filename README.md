# o-lab-mentorshipbookingsample

To run This project you need to set up and run two components:
#### Back-end server
```
cd api
python3 manage.py runserver
```
This runs the django backend server at 127.0.0.1:8000.
Please make sure you have installed python3, django framework and django-cors
```
python3 -m pip install django-cors-headers
```

#### Front-end server
```
cd client
npm install
npm run dev
```

## Bonous
Everytime you book, an E-mail notification is sent to the mailtrap account.
I used my own mailtrap account, you can use your credentials by setting them up at `api/api/settings.py` with setting the following keys:

```
# mailtrap settings
...
EMAIL_HOST_USER = 'your user key'  
EMAIL_HOST_PASSWORD = 'your password key'  
...
```

## Important Notice
Please visit [http://localhost:3000](http://localhost:3000) to test the application. Django developement server seems to have trouble mapping IP (127.0.0.1) to domain name (localhost). If you use IP, most likely you will experience denial by django CORS.