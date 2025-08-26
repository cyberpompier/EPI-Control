"use client";

import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/components/auth/SessionProvider';
import { getInitials } from '@/lib/utils.tsx';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// ... rest of the component code