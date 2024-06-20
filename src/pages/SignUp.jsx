import React, { useEffect, useState } from 'react';
import { Amplify } from 'aws-amplify';
import { signUp } from 'aws-amplify/auth';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';

import amplifyOutput from '../../amplify-output';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import axiosInstance from '@/lib/axiosInstance';

Amplify.configure(amplifyOutput);

const commonSecurityQuestions = [
  "What was your childhood nickname?",
  "What is the name of your favorite childhood friend?",
  "What was the name of your first pet?",
  "What was the name of the street you grew up on?",
  "What is your mother's maiden name?",
  "What is the name of your first school?",
  "What was your dream job as a child?",
  "What is the name of your favorite teacher?",
];

const schema = z.object({
  email: z.string().min(1, "Email is required.").email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter'),
  confirmPassword: z.string(),
  userRole: z.string().min(1, 'User role is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const SignUp = () => {

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [authStage, setAuthStage] = useState(1);
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole) navigate("/")
  }, [userRole])

  const onSubmit = async (data) => {
    const { email, password, question, answer, userRole } = data;

    console.log(data);

    setLoading(true);

    try {
      if (authStage === 1) {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              'custom:userRole': userRole
            },
          }
        });
        setAuthStage(2)
      } else if (authStage === 2) {
        await axiosInstance.post(import.meta.env.VITE_POST_SECURITY_QUESTION_URL, {
          email,
          question,
          answer
        });
        await axiosInstance.post(import.meta.env.VITE_COGNITO_CONFIRM_USER_URL, {
          "userPoolId": import.meta.env.VITE_AWS_USER_POOLS_ID,
          "username": email
        });
        toast.success('Sign up successful!');
        navigate('/signin');
      }
    } catch (error) {
      console.log('Error signing up:', error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit,console.error)} className="space-y-4">
        {authStage === 1 && (
          <>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.email && <p className="text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.password && <p className="text-red-600">{errors.password.message}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                {...register('confirmPassword')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
            </div>
            <div>
              <Label htmlFor="userRole">User Role</Label>
              <select
                id="userRole"
                {...register('userRole')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="admin0">Admin</option>
                <option value="regular">Regular</option>
              </select>
              {errors.userRole && <p className="text-x`red-600">{errors.userRole.message}</p>}
            </div>
          </>
        )}
        {authStage === 2 && (
          <>
            <div>
              <Label htmlFor="question">Security Question</Label>
              <select
                id="question"
                {...register('question')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {commonSecurityQuestions.map((question, index) => (
                  <option key={index} value={question}>{question}</option>
                ))}
              </select>
              {errors.question && <p className="text-red-600">{errors.question.message}</p>}
            </div>
            <div>
              <Label htmlFor="answer">Answer</Label>
              <Input
                id="answer"
                type="text"
                required
                placeholder="Answer"
                {...register('answer')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.answer && <p className="text-red-600">{errors.answer.message}</p>}
            </div>
          </>
        )}
        <Button disabled={loading} type="submit" className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}>
          {authStage === 1 ? 'Next' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}

export default SignUp;
