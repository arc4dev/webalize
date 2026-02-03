import type { CollectionConfig } from 'payload'
import { anyone } from '@/access/anyone'
import { isAdmin } from '@/access/isAdmin'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    group: 'CRM',
    defaultColumns: ['type', 'fullName', 'email', 'createdAt'],
  },
  access: {
    read: isAdmin, // Only admins can read form submissions
    create: anyone, // Anyone can submit forms (public forms)
    update: isAdmin, // Only admins can update
    delete: isAdmin, // Only admins can delete
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Book a Call', value: 'book-call' },
        { label: 'Contact Form', value: 'contact' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
      admin: {
        description: 'Type of form submission',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Full name of the person submitting',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      admin: {
        description: 'Email address',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      admin: {
        description: 'Company name (optional)',
      },
    },
    {
      name: 'phoneCountryCode',
      type: 'text',
      admin: {
        description: 'Country code (e.g., +48, +1)',
      },
    },
    {
      name: 'phoneNumber',
      type: 'text',
      admin: {
        description: 'Phone number without country code',
      },
    },
    {
      name: 'preferredDate',
      type: 'date',
      admin: {
        description: 'Preferred date for call/meeting',
      },
    },
    {
      name: 'privacyConsent',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: {
        description: 'User accepted privacy policy',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Closed', value: 'closed' },
      ],
      admin: {
        description: 'Status of the submission',
      },
    },
  ],
  timestamps: true,
}
