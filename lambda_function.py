import json
import boto3
from botocore.exceptions import ClientError

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    invocation_source = event['invocationSource']
    
    print('InvocationSource:', invocation_source)
    print('Intent:', intent)
    print('Slots:', slots)
    
    if intent == 'BookingIntent':
        return handle_booking_intent(event)
    elif intent == 'CustomerIntent':
        return handle_customer_intent(event)
    else:
        return fallback_response(event)

def handle_booking_intent(event):
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']

    validation_result = validate_booking_ref(slots)
    
    if event['invocationSource'] == 'DialogCodeHook':
        if not validation_result['isValid']:
            response = {
                "sessionState": {
                    "dialogAction": {
                        "slotToElicit": validation_result['violatedSlot'],
                        "type": "ElicitSlot"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
            return response  

        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Delegate"
                },
                "intent": {
                    'name': intent,
                    'slots': slots
                }
            }
        }
        return response 
        
    if event['invocationSource'] == 'FulfillmentCodeHook':
        booking_reference = slots['BookingReferenceID']['value']['interpretedValue']
        
        try:
            response = dynamodb.get_item(
                TableName='Bookings',
                Key={
                    'BookingReferenceID': {'S': booking_reference}
                }
            )
            
            if 'Item' in response:
                item = response['Item']
                
                # Extract specific details based on user's query
                requested_info = slots.get('requestedInfo', {}).get('value', {}).get('interpretedValue', '').lower()
                if requested_info == 'room number':
                    room_number = int(item.get('RoomNumber', {}).get('N', 0))
                    message = f"The room number for your booking is {room_number}."
                elif requested_info == 'duration of stay':
                    duration = item.get('Duration', {}).get('S', 'N/A')
                    message = f"The duration of your stay is {duration}."
                elif requested_info == 'booking status':
                    booking_status = item.get('BookingStatus', {}).get('S', 'N/A')
                    message = f"The booking status is {booking_status}."
                else:
                    # Default to full booking details
                    room_number = int(item.get('RoomNumber', {}).get('N', 0))
                    duration = item.get('Duration', {}).get('S', 'N/A')
                    booking_status = item.get('BookingStatus', {}).get('S', 'N/A')
                    check_in_date = item.get('CheckInDate', {}).get('S', 'N/A')
                    check_out_date = item.get('CheckOutDate', {}).get('S', 'N/A')
                    email_address = item.get('EmailAddress', {}).get('S', 'N/A')
                    
                    message = (f"Booking Details:\n"
                               f"Room Number: {room_number}\n"
                               f"Booking Status: {booking_status}\n"
                               f"Stay Duration: {duration}\n"
                               f"Check-In Date: {check_in_date}\n"
                               f"Check-Out Date: {check_out_date}\n"
                               f"Email Address: {email_address}")
                
                response_text = message
            else:
                response_text = "Sorry, I couldn't find your booking reference. Please try again."
            
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Fulfilled"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots,
                        'state': 'Fulfilled'
                    }
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": response_text
                    }
                ]
            }
        except ClientError as e:
            print(f"Error retrieving booking details: {e}")
            response_text = "Sorry, there was an error retrieving your booking details. Please try again later."
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Failed"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots,
                        'state': 'Failed'
                    }
                },
                "messages": [
                    {
                        "contentType": "PlainText",
                        "content": response_text
                    }
                ]
            }
        
        return response

def handle_customer_intent(event):
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    
    if event['invocationSource'] == 'DialogCodeHook':

        if not slots['EmailAddress'] or not slots['CustomerConcern']:
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "ElicitSlot",
                        "slotToElicit": 'EmailAddress' if not slots['EmailAddress'] else 'CustomerConcern'
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
            return response

        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Delegate"
                },
                "intent": {
                    'name': intent,
                    'slots': slots
                }
            }
        }
        return response
    
    if event['invocationSource'] == 'FulfillmentCodeHook':
        email_address = slots['EmailAddress']['value']['interpretedValue']
        customer_concern = slots['CustomerConcern']['value']['interpretedValue']
        
        try:
           
            dynamodb.put_item(
                TableName='customerconcerns',
                Item={
                    'EmailAddress': {'S': email_address},
                    'CustomerConcern': {'S': customer_concern}
                }
            )
            
            message = "Thank you for your concern. We have recorded your concern and will get back to you shortly."
        except ClientError as e:
            print(f"Error recording customer concern: {e}")
            message = "Sorry, there was an error recording your concern. Please try again later."
        
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled"
                },
                "intent": {
                    'name': intent,
                    'slots': slots,
                    'state': 'Fulfilled'
                }
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": message
                }
            ]
        }
        return response

def validate_booking_ref(slots):
    if not slots['BookingReferenceID']:
        return {
            'isValid': False,
            'violatedSlot': 'BookingReferenceID'
        }
    return {'isValid': True}

def fallback_response(event):
    intent = event['sessionState']['intent']['name']
    slots = event['sessionState']['intent']['slots']
    response = {
        "sessionState": {
            "dialogAction": {
                "type": "Close",
                "fulfillmentState": "Failed"
            },
            "intent": {
                'name': intent,
                'slots': slots,
                'state': 'Failed'
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": "Sorry, I could not understand your request. Please try again."
            }
        ]
    }
    return response
