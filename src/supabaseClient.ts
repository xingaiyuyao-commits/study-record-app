import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ggdqtdpzqgnrmqawxexj.supabase.co";
const supabaseAnonKey = "sb_publishable_2cf6Ma0LBl_hVf66vCBFUA_VgQlhVJB";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);