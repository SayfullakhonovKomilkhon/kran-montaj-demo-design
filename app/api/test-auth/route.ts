import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkvgjrywutnudwcoekmf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdmdqcnl3dXRudWR3Y29la21mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3NDM2NTYsImV4cCI6MjA4NDMxOTY1Nn0.Ztu7mFeaaZq8Cp4NrKLtzc4C3MqU_f9uxd3ExGmlsvM';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    console.log('Testing auth with:', { email, passwordLength: password?.length });
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    // Test connection first
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .select('count')
      .limit(1);
    
    console.log('Connection test:', { testData, testError });
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });
    
    if (error) {
      console.error('Auth error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        errorCode: error.status,
        connectionTest: testError ? 'failed' : 'success'
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: true, 
      user: data.user?.email,
      connectionTest: 'success'
    });
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Server error',
      details: String(error)
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (error) {
      return NextResponse.json({ 
        status: 'error',
        message: 'Database connection failed',
        error: error.message
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: 'ok',
      message: 'Supabase connection successful',
      supabaseUrl,
      hasData: data && data.length > 0
    });
    
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      error: String(error)
    }, { status: 500 });
  }
}
