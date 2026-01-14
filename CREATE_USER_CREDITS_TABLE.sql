-- Nueva tabla: user_credits (en vez de licenses)
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT auth.uid(),
    email TEXT NOT NULL UNIQUE,
    credits INTEGER DEFAULT 0,
    subscription_type TEXT DEFAULT 'free', -- 'free', 'x1', 'x5', 'vip_unlimited'
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own credits
CREATE POLICY "Users can read own credits" 
    ON user_credits FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Users can update their own record (for edge cases)
CREATE POLICY "Users can update own credits" 
    ON user_credits FOR UPDATE 
    USING (auth.uid() = id);

-- Policy: Service role can do anything (for webhooks)
CREATE POLICY "Service role full access" 
    ON user_credits FOR ALL 
    USING (auth.role() = 'service_role');

-- Function to auto-create user_credits on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_credits (id, email, credits)
    VALUES (NEW.id, NEW.email, 1); -- 1 free trial credit
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Create user_credits when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Keep prediction_history (update to use user_id instead of license_key)
ALTER TABLE prediction_history 
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES user_credits(id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_credits_email ON user_credits(email);
CREATE INDEX IF NOT EXISTS idx_prediction_history_user ON prediction_history(user_id);
