import json
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

class MentorListView(View):
    # returns a list of all mentors available
    def get(self, request):
        with open('bookings/data.json') as f:
            data = json.load(f)
        return JsonResponse(data['mentors'], safe=False)

@method_decorator(csrf_exempt, name='dispatch')
class BookingView(View):
    # returns a list of 
    def get(self, request):
        try:
            with open('bookings/data.json') as f:
                data = json.load(f)
            return JsonResponse(data['bookings'], safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
    def post(self, request):
        try:
            booking_data = json.loads(request.body)
            mentor_id = booking_data.get('mentorId')

            # Validate mentorId
            if mentor_id is None:
                return JsonResponse({'error': 'mentorId is required'}, status=400)

            # Load existing bookings and users
            with open('bookings/data.json') as f:
                data = json.load(f)

            # Append the new booking
            data['bookings'].append(booking_data)

            # Save the updated data back to the file
            with open('bookings/data.json', 'w') as f:
                json.dump(data, f)

            # Send email notification
            user_email = data['users'][0]['username']  # Assuming you want to send to the first user
            mentor = next((m for m in data['mentors'] if m['id'] == mentor_id), None)

            if mentor:
                subject = 'Booking Confirmation'
                message = f'You have successfully booked {mentor["name"]} with expertise in {mentor["expertise"]}.'

                # Send the email 
                send_mail(
                    subject,
                    message,
                    'from@example.com',
                    [user_email],
                    fail_silently=False,
                )

            return JsonResponse(booking_data, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
        
@method_decorator(csrf_exempt, name='dispatch')
class LoginView(View):
    def post(self, request):
        print('hit')
        try:
            login_data = json.loads(request.body)
            username = login_data.get('username')
            password = login_data.get('password')

            # Load user data from data.json
            with open('bookings/data.json') as f:
                data = json.load(f)

            # Check if the username and password match
            user = next((user for user in data.get('users', []) if user['username'] == username and user['password'] == password), None)

            if user:
                return JsonResponse({'message': 'Login successful'}, status=200)
            else:
                return JsonResponse({'error': 'User not found!'}, status=404)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)