// Typen van het publieke schema, in het formaat van `supabase gen types typescript`.
// Afgeleid van supabase/migrations/* (spec 10 §5) zolang groos-dev nog geen schema
// heeft. Vervang dit bestand met `npm run db:types` zodra de migraties op
// groos-dev staan, en niet met de hand wijzigen daarna.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          actor_id: string | null
          body: string | null
          created_at: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id: string
          kind: Database["public"]["Enums"]["activity_kind"]
          payload: Json | null
        }
        Insert: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["entity_type"]
          id?: string
          kind: Database["public"]["Enums"]["activity_kind"]
          payload?: Json | null
        }
        Update: {
          actor_id?: string | null
          body?: string | null
          created_at?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["entity_type"]
          id?: string
          kind?: Database["public"]["Enums"]["activity_kind"]
          payload?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          created_at: string
          display_name: string
          email: string
          full_name: string
          id: string
          is_active: boolean
          last_seen_at: string | null
          notify_applications: boolean
          notify_messages: boolean
          notify_staff_requests: boolean
          phone_e164: string | null
          photo_path: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
          whatsapp_e164: string | null
        }
        Insert: {
          created_at?: string
          display_name: string
          email: string
          full_name: string
          id: string
          is_active?: boolean
          last_seen_at?: string | null
          notify_applications?: boolean
          notify_messages?: boolean
          notify_staff_requests?: boolean
          phone_e164?: string | null
          photo_path?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          whatsapp_e164?: string | null
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean
          last_seen_at?: string | null
          notify_applications?: boolean
          notify_messages?: boolean
          notify_staff_requests?: boolean
          phone_e164?: string | null
          photo_path?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
          whatsapp_e164?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          anonymized_at: string | null
          assigned_to: string | null
          available_from: string | null
          city: string | null
          completed_at: string | null
          created_at: string
          cv_filename: string | null
          cv_mime: string | null
          cv_path: string | null
          cv_size: number | null
          email: string | null
          first_name: string | null
          has_driving_license_b: boolean | null
          id: string
          kind: Database["public"]["Enums"]["application_kind"]
          last_contact_at: string | null
          last_name: string | null
          locale: Database["public"]["Enums"]["app_locale"]
          may_work_in_nl: boolean | null
          message: string | null
          occupation_slugs: string[]
          phone_e164: string | null
          privacy_notice_version: string | null
          reference: string
          retain_until: string
          retention_consent: boolean
          retention_consent_at: string | null
          retention_consent_source: Database["public"]["Enums"]["consent_source"] | null
          source: Database["public"]["Enums"]["application_source"]
          status: Database["public"]["Enums"]["application_status"]
          status_changed_at: string
          submission_id: string | null
          updated_at: string
          utm: Json | null
          vacancy_id: string | null
          vacancy_number: number | null
          vacancy_title_snapshot: string | null
        }
        Insert: {
          anonymized_at?: string | null
          assigned_to?: string | null
          available_from?: string | null
          city?: string | null
          completed_at?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_mime?: string | null
          cv_path?: string | null
          cv_size?: number | null
          email?: string | null
          first_name?: string | null
          has_driving_license_b?: boolean | null
          id?: string
          kind?: Database["public"]["Enums"]["application_kind"]
          last_contact_at?: string | null
          last_name?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          may_work_in_nl?: boolean | null
          message?: string | null
          occupation_slugs?: string[]
          phone_e164?: string | null
          privacy_notice_version?: string | null
          reference?: string
          retain_until?: string
          retention_consent?: boolean
          retention_consent_at?: string | null
          retention_consent_source?: Database["public"]["Enums"]["consent_source"] | null
          source?: Database["public"]["Enums"]["application_source"]
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string
          submission_id?: string | null
          updated_at?: string
          utm?: Json | null
          vacancy_id?: string | null
          vacancy_number?: number | null
          vacancy_title_snapshot?: string | null
        }
        Update: {
          anonymized_at?: string | null
          assigned_to?: string | null
          available_from?: string | null
          city?: string | null
          completed_at?: string | null
          created_at?: string
          cv_filename?: string | null
          cv_mime?: string | null
          cv_path?: string | null
          cv_size?: number | null
          email?: string | null
          first_name?: string | null
          has_driving_license_b?: boolean | null
          id?: string
          kind?: Database["public"]["Enums"]["application_kind"]
          last_contact_at?: string | null
          last_name?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          may_work_in_nl?: boolean | null
          message?: string | null
          occupation_slugs?: string[]
          phone_e164?: string | null
          privacy_notice_version?: string | null
          reference?: string
          retain_until?: string
          retention_consent?: boolean
          retention_consent_at?: string | null
          retention_consent_source?: Database["public"]["Enums"]["consent_source"] | null
          source?: Database["public"]["Enums"]["application_source"]
          status?: Database["public"]["Enums"]["application_status"]
          status_changed_at?: string
          submission_id?: string | null
          updated_at?: string
          utm?: Json | null
          vacancy_id?: string | null
          vacancy_number?: number | null
          vacancy_title_snapshot?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_type: Database["public"]["Enums"]["audit_actor"]
          changes: Json | null
          entity_id: string | null
          entity_type: string | null
          id: number
          ip_hash: string | null
          occurred_at: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_type: Database["public"]["Enums"]["audit_actor"]
          changes?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          ip_hash?: string | null
          occurred_at?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_type?: Database["public"]["Enums"]["audit_actor"]
          changes?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: never
          ip_hash?: string | null
          occurred_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string | null
          handled_at: string | null
          handled_by: string | null
          id: string
          locale: Database["public"]["Enums"]["app_locale"]
          message: string | null
          name: string
          phone_e164: string | null
          privacy_notice_version: string | null
          retain_until: string
          status: Database["public"]["Enums"]["message_status"]
          status_changed_at: string
          submission_id: string | null
          topic: Database["public"]["Enums"]["contact_topic"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          locale?: Database["public"]["Enums"]["app_locale"]
          message?: string | null
          name: string
          phone_e164?: string | null
          privacy_notice_version?: string | null
          retain_until?: string
          status?: Database["public"]["Enums"]["message_status"]
          status_changed_at?: string
          submission_id?: string | null
          topic?: Database["public"]["Enums"]["contact_topic"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          handled_at?: string | null
          handled_by?: string | null
          id?: string
          locale?: Database["public"]["Enums"]["app_locale"]
          message?: string | null
          name?: string
          phone_e164?: string | null
          privacy_notice_version?: string | null
          retain_until?: string
          status?: Database["public"]["Enums"]["message_status"]
          status_changed_at?: string
          submission_id?: string | null
          topic?: Database["public"]["Enums"]["contact_topic"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_messages_handled_by_fkey"
            columns: ["handled_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_log: {
        Row: {
          created_at: string
          entity_id: string | null
          entity_type: Database["public"]["Enums"]["entity_type"] | null
          error: string | null
          id: number
          provider_message_id: string | null
          status: Database["public"]["Enums"]["email_status"]
          template: string
          to_hash: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          error?: string | null
          id?: never
          provider_message_id?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          template: string
          to_hash: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          entity_type?: Database["public"]["Enums"]["entity_type"] | null
          error?: string | null
          id?: never
          provider_message_id?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          template?: string
          to_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      occupations: {
        Row: {
          created_at: string
          is_active: boolean
          name_en: string
          name_nl: string
          plural_en: string
          plural_nl: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          is_active?: boolean
          name_en: string
          name_nl: string
          plural_en: string
          plural_nl: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          is_active?: boolean
          name_en?: string
          name_nl?: string
          plural_en?: string
          plural_nl?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      staff_requests: {
        Row: {
          assigned_to: string | null
          company_name: string
          contact_name: string
          created_at: string
          description: string | null
          duration: Database["public"]["Enums"]["request_duration"]
          email: string
          headcount: number
          hours_per_week: number | null
          id: string
          kvk_number: string | null
          locale: Database["public"]["Enums"]["app_locale"]
          occupation_other: string | null
          occupation_slugs: string[]
          phone_e164: string
          privacy_notice_version: string | null
          reference: string
          retain_until: string
          start_asap: boolean
          start_date: string | null
          status: Database["public"]["Enums"]["staff_request_status"]
          status_changed_at: string
          submission_id: string | null
          updated_at: string
          utm: Json | null
          work_city: string
        }
        Insert: {
          assigned_to?: string | null
          company_name: string
          contact_name: string
          created_at?: string
          description?: string | null
          duration?: Database["public"]["Enums"]["request_duration"]
          email: string
          headcount: number
          hours_per_week?: number | null
          id?: string
          kvk_number?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          occupation_other?: string | null
          occupation_slugs?: string[]
          phone_e164: string
          privacy_notice_version?: string | null
          reference?: string
          retain_until?: string
          start_asap?: boolean
          start_date?: string | null
          status?: Database["public"]["Enums"]["staff_request_status"]
          status_changed_at?: string
          submission_id?: string | null
          updated_at?: string
          utm?: Json | null
          work_city: string
        }
        Update: {
          assigned_to?: string | null
          company_name?: string
          contact_name?: string
          created_at?: string
          description?: string | null
          duration?: Database["public"]["Enums"]["request_duration"]
          email?: string
          headcount?: number
          hours_per_week?: number | null
          id?: string
          kvk_number?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          occupation_other?: string | null
          occupation_slugs?: string[]
          phone_e164?: string
          privacy_notice_version?: string | null
          reference?: string
          retain_until?: string
          start_asap?: boolean
          start_date?: string | null
          status?: Database["public"]["Enums"]["staff_request_status"]
          status_changed_at?: string
          submission_id?: string | null
          updated_at?: string
          utm?: Json | null
          work_city?: string
        }
        Relationships: [
          {
            foreignKeyName: "staff_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vacancies: {
        Row: {
          allow_whatsapp_apply: boolean
          archived_at: string | null
          city: string | null
          city_slug: string | null
          close_reason: Database["public"]["Enums"]["vacancy_close_reason"] | null
          closed_at: string | null
          closes_at: string | null
          contact_admin_id: string | null
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          created_by: string | null
          education_level: Database["public"]["Enums"]["education_level"]
          experience_level: Database["public"]["Enums"]["experience_level"]
          experience_months: number | null
          hours_max: number | null
          hours_min: number | null
          id: string
          image_path: string | null
          is_featured: boolean
          is_urgent: boolean
          location_label: string | null
          min_age_18: boolean
          min_age_reason: Database["public"]["Enums"]["min_age_reason"] | null
          number: number
          occupation_slug: string
          positions_count: number
          postal_code: string | null
          preferred_qualifications: Database["public"]["Enums"]["qualification"][]
          province: string
          publish_at: string | null
          published_at: string | null
          required_qualifications: Database["public"]["Enums"]["qualification"][]
          salary_max: number | null
          salary_min: number | null
          salary_note: string | null
          shifts: Database["public"]["Enums"]["shift"][]
          start_asap: boolean
          start_date: string | null
          status: Database["public"]["Enums"]["vacancy_status"]
          status_changed_at: string
          training_offered: Database["public"]["Enums"]["qualification"][]
          updated_at: string
          updated_by: string | null
          workplace_language: Database["public"]["Enums"]["workplace_language"] | null
        }
        Insert: {
          allow_whatsapp_apply?: boolean
          archived_at?: string | null
          city?: string | null
          city_slug?: string | null
          close_reason?: Database["public"]["Enums"]["vacancy_close_reason"] | null
          closed_at?: string | null
          closes_at?: string | null
          contact_admin_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          education_level?: Database["public"]["Enums"]["education_level"]
          experience_level?: Database["public"]["Enums"]["experience_level"]
          experience_months?: number | null
          hours_max?: number | null
          hours_min?: number | null
          id?: string
          image_path?: string | null
          is_featured?: boolean
          is_urgent?: boolean
          location_label?: string | null
          min_age_18?: boolean
          min_age_reason?: Database["public"]["Enums"]["min_age_reason"] | null
          number?: number
          occupation_slug: string
          positions_count?: number
          postal_code?: string | null
          preferred_qualifications?: Database["public"]["Enums"]["qualification"][]
          province?: string
          publish_at?: string | null
          published_at?: string | null
          required_qualifications?: Database["public"]["Enums"]["qualification"][]
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          shifts?: Database["public"]["Enums"]["shift"][]
          start_asap?: boolean
          start_date?: string | null
          status?: Database["public"]["Enums"]["vacancy_status"]
          status_changed_at?: string
          training_offered?: Database["public"]["Enums"]["qualification"][]
          updated_at?: string
          updated_by?: string | null
          workplace_language?: Database["public"]["Enums"]["workplace_language"] | null
        }
        Update: {
          allow_whatsapp_apply?: boolean
          archived_at?: string | null
          city?: string | null
          city_slug?: string | null
          close_reason?: Database["public"]["Enums"]["vacancy_close_reason"] | null
          closed_at?: string | null
          closes_at?: string | null
          contact_admin_id?: string | null
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          created_by?: string | null
          education_level?: Database["public"]["Enums"]["education_level"]
          experience_level?: Database["public"]["Enums"]["experience_level"]
          experience_months?: number | null
          hours_max?: number | null
          hours_min?: number | null
          id?: string
          image_path?: string | null
          is_featured?: boolean
          is_urgent?: boolean
          location_label?: string | null
          min_age_18?: boolean
          min_age_reason?: Database["public"]["Enums"]["min_age_reason"] | null
          number?: number
          occupation_slug?: string
          positions_count?: number
          postal_code?: string | null
          preferred_qualifications?: Database["public"]["Enums"]["qualification"][]
          province?: string
          publish_at?: string | null
          published_at?: string | null
          required_qualifications?: Database["public"]["Enums"]["qualification"][]
          salary_max?: number | null
          salary_min?: number | null
          salary_note?: string | null
          shifts?: Database["public"]["Enums"]["shift"][]
          start_asap?: boolean
          start_date?: string | null
          status?: Database["public"]["Enums"]["vacancy_status"]
          status_changed_at?: string
          training_offered?: Database["public"]["Enums"]["qualification"][]
          updated_at?: string
          updated_by?: string | null
          workplace_language?: Database["public"]["Enums"]["workplace_language"] | null
        }
        Relationships: [
          {
            foreignKeyName: "vacancies_contact_admin_id_fkey"
            columns: ["contact_admin_id"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacancies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vacancies_occupation_slug_fkey"
            columns: ["occupation_slug"]
            isOneToOne: false
            referencedRelation: "occupations"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "vacancies_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admin_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vacancy_translations: {
        Row: {
          created_at: string
          extra: string | null
          intro: string | null
          locale: Database["public"]["Enums"]["app_locale"]
          offer: string[]
          requirements: string[]
          seo_description: string | null
          seo_title: string | null
          slug: string
          summary: string | null
          tasks: string[]
          title: string
          updated_at: string
          vacancy_id: string
        }
        Insert: {
          created_at?: string
          extra?: string | null
          intro?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          offer?: string[]
          requirements?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          summary?: string | null
          tasks?: string[]
          title: string
          updated_at?: string
          vacancy_id: string
        }
        Update: {
          created_at?: string
          extra?: string | null
          intro?: string | null
          locale?: Database["public"]["Enums"]["app_locale"]
          offer?: string[]
          requirements?: string[]
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          summary?: string | null
          tasks?: string[]
          title?: string
          updated_at?: string
          vacancy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vacancy_translations_vacancy_id_fkey"
            columns: ["vacancy_id"]
            isOneToOne: false
            referencedRelation: "vacancies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_vacancies: {
        Row: {
          allow_whatsapp_apply: boolean | null
          city: string | null
          city_slug: string | null
          close_reason: Database["public"]["Enums"]["vacancy_close_reason"] | null
          closed_at: string | null
          closes_at: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_photo_path: string | null
          contact_whatsapp: string | null
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          education_level: Database["public"]["Enums"]["education_level"] | null
          experience_level: Database["public"]["Enums"]["experience_level"] | null
          experience_months: number | null
          extra: string | null
          hours_max: number | null
          hours_min: number | null
          id: string | null
          image_path: string | null
          intro: string | null
          is_featured: boolean | null
          is_urgent: boolean | null
          location_label: string | null
          min_age_18: boolean | null
          min_age_reason: Database["public"]["Enums"]["min_age_reason"] | null
          number: number | null
          occupation_name_en: string | null
          occupation_name_nl: string | null
          occupation_plural_en: string | null
          occupation_plural_nl: string | null
          occupation_slug: string | null
          offer: string[] | null
          positions_count: number | null
          postal_code: string | null
          preferred_qualifications: Database["public"]["Enums"]["qualification"][] | null
          province: string | null
          published_at: string | null
          required_qualifications: Database["public"]["Enums"]["qualification"][] | null
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          salary_note: string | null
          seo_description: string | null
          seo_title: string | null
          shifts: Database["public"]["Enums"]["shift"][] | null
          slug: string | null
          start_asap: boolean | null
          start_date: string | null
          state: string | null
          summary: string | null
          tasks: string[] | null
          title: string | null
          training_offered: Database["public"]["Enums"]["qualification"][] | null
          updated_at: string | null
          workplace_language: Database["public"]["Enums"]["workplace_language"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      anonymize_applications: {
        Args: {
          p_ids: string[]
        }
        Returns: number
      }
      application_retain_until: {
        Args: {
          p_kind: Database["public"]["Enums"]["application_kind"]
          p_created_at: string
          p_last_contact_at: string
          p_completed_at: string
          p_consent: boolean
          p_consent_at: string
        }
        Returns: string
      }
      auto_close_stale_applications: {
        Args: never
        Returns: number
      }
      duplicate_vacancy: {
        Args: {
          p_id: string
        }
        Returns: {
          vacancy_id: string
          vacancy_number: number
        }[]
      }
      grant_admin: {
        Args: {
          p_email: string
          p_full_name: string
          p_display_name: string
          p_role?: Database["public"]["Enums"]["admin_role"]
          p_phone?: string
          p_whatsapp?: string
        }
        Returns: string
      }
      is_admin: {
        Args: never
        Returns: boolean
      }
      is_owner: {
        Args: never
        Returns: boolean
      }
      normalize_city: {
        Args: {
          p_city: string
        }
        Returns: string
      }
      purge_expired_records: {
        Args: never
        Returns: Json
      }
      purge_logs: {
        Args: never
        Returns: Json
      }
      run_vacancy_lifecycle: {
        Args: never
        Returns: {
          event: string
          vacancy_number: number
        }[]
      }
      save_vacancy: {
        Args: {
          p_id: string
          p_vacancy: Json
          p_nl: Json
        }
        Returns: {
          vacancy_id: string
          vacancy_number: number
          vacancy_slug: string
        }[]
      }
      slugify: {
        Args: {
          p_text: string
        }
        Returns: string
      }
      text_items_valid: {
        Args: {
          p_items: string[]
          p_max_len: number
        }
        Returns: boolean
      }
      vacancy_public_state: {
        Args: {
          p_status: Database["public"]["Enums"]["vacancy_status"]
          p_publish_at: string
          p_closes_at: string
          p_closed_at: string
        }
        Returns: string
      }
      vacancy_publish_errors: {
        Args: {
          p_vacancy_id: string
        }
        Returns: string[]
      }
      vacancy_slug: {
        Args: {
          p_title: string
          p_city_slug: string
          p_number: number
        }
        Returns: string
      }
    }
    Enums: {
      activity_kind:
        | "note"
        | "status_change"
        | "call"
        | "whatsapp"
        | "email_sent"
        | "cv_viewed"
        | "assigned"
        | "consent_recorded"
        | "auto_closed"
      admin_role:
        | "owner"
        | "recruiter"
      app_locale:
        | "nl"
        | "en"
      application_kind:
        | "vacancy"
        | "registration"
      application_source:
        | "website"
        | "whatsapp"
        | "phone"
        | "walk_in"
        | "email"
        | "referral"
        | "job_board"
        | "other"
      application_status:
        | "new"
        | "in_progress"
        | "invited"
        | "placed"
        | "rejected"
        | "withdrawn"
      audit_actor:
        | "admin"
        | "system"
        | "public"
      consent_source:
        | "form"
        | "phone"
        | "email"
        | "in_person"
      contact_topic:
        | "job_seeker"
        | "employer"
        | "callback"
        | "other"
      contract_type:
        | "temp_agency"
        | "secondment"
        | "recruitment"
      education_level:
        | "none"
        | "vmbo"
        | "mbo1"
        | "mbo2"
        | "mbo3"
        | "mbo4"
        | "havo_vwo"
        | "hbo"
        | "wo"
      email_status:
        | "queued"
        | "sent"
        | "delivered"
        | "bounced"
        | "failed"
      entity_type:
        | "vacancy"
        | "application"
        | "staff_request"
        | "contact_message"
      experience_level:
        | "none"
        | "nice_to_have"
        | "required"
      message_status:
        | "new"
        | "answered"
        | "archived"
        | "spam"
      min_age_reason:
        | "work_at_height"
        | "construction_demolition"
        | "forklift"
        | "night_work"
        | "hazardous_substances"
      qualification:
        | "vca_basis"
        | "vca_vol"
        | "heftruck"
        | "reachtruck"
        | "ept"
        | "ipaf"
        | "vog"
        | "rijbewijs_b"
        | "rijbewijs_be"
        | "rijbewijs_c"
        | "code_95"
        | "ras"
      request_duration:
        | "one_day"
        | "days"
        | "weeks"
        | "months"
        | "indefinite"
        | "unknown"
      shift:
        | "early"
        | "day"
        | "evening"
        | "night"
        | "weekend"
      staff_request_status:
        | "new"
        | "in_progress"
        | "quote_sent"
        | "started"
        | "completed"
        | "cancelled"
      vacancy_close_reason:
        | "filled"
        | "expired"
        | "withdrawn"
        | "other"
      vacancy_status:
        | "draft"
        | "scheduled"
        | "published"
        | "closed"
        | "archived"
      workplace_language: "nl" | "en" | "nl_or_en"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]
type PublicRelations = PublicSchema["Tables"] & PublicSchema["Views"]

export type Tables<T extends keyof PublicRelations> = PublicRelations[T] extends { Row: infer R } ? R : never

export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T] extends {
  Insert: infer I
}
  ? I
  : never

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T] extends {
  Update: infer U
}
  ? U
  : never

export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

export const Constants = {
  public: {
    Enums: {
      activity_kind: ["note", "status_change", "call", "whatsapp", "email_sent", "cv_viewed", "assigned", "consent_recorded", "auto_closed"],
      admin_role: ["owner", "recruiter"],
      app_locale: ["nl", "en"],
      application_kind: ["vacancy", "registration"],
      application_source: ["website", "whatsapp", "phone", "walk_in", "email", "referral", "job_board", "other"],
      application_status: ["new", "in_progress", "invited", "placed", "rejected", "withdrawn"],
      audit_actor: ["admin", "system", "public"],
      consent_source: ["form", "phone", "email", "in_person"],
      contact_topic: ["job_seeker", "employer", "callback", "other"],
      contract_type: ["temp_agency", "secondment", "recruitment"],
      education_level: ["none", "vmbo", "mbo1", "mbo2", "mbo3", "mbo4", "havo_vwo", "hbo", "wo"],
      email_status: ["queued", "sent", "delivered", "bounced", "failed"],
      entity_type: ["vacancy", "application", "staff_request", "contact_message"],
      experience_level: ["none", "nice_to_have", "required"],
      message_status: ["new", "answered", "archived", "spam"],
      min_age_reason: ["work_at_height", "construction_demolition", "forklift", "night_work", "hazardous_substances"],
      qualification: ["vca_basis", "vca_vol", "heftruck", "reachtruck", "ept", "ipaf", "vog", "rijbewijs_b", "rijbewijs_be", "rijbewijs_c", "code_95", "ras"],
      request_duration: ["one_day", "days", "weeks", "months", "indefinite", "unknown"],
      shift: ["early", "day", "evening", "night", "weekend"],
      staff_request_status: ["new", "in_progress", "quote_sent", "started", "completed", "cancelled"],
      vacancy_close_reason: ["filled", "expired", "withdrawn", "other"],
      vacancy_status: ["draft", "scheduled", "published", "closed", "archived"],
      workplace_language: ["nl", "en", "nl_or_en"],
    },
  },
} as const
