import type { Condition, ClinicHours } from './types';

export const CONDITIONS: Condition[] = [
  { slug: 'back-pain-sciatica', title: 'Back Pain and Sciatica', description: 'Expert treatment for lumbar disc conditions, spinal stenosis, and sciatic nerve pain along the full nerve pathway.' },
  { slug: 'neck-pain-whiplash', title: 'Neck Pain and Whiplash', description: 'Comprehensive cervical spine assessment and mobilisation for acute and chronic neck conditions.' },
  { slug: 'arthritis', title: 'Arthritis', description: 'Evidence-based strategies to reduce pain, improve joint mobility, and maintain quality of life.' },
  { slug: 'sports-injuries', title: 'Sports Injuries', description: 'From acute ligament sprains to chronic overuse conditions — treatment for athletes at every level.' },
  { slug: 'work-related-injury', title: 'Work Related Injury or Pain', description: 'Assessment and rehabilitation for workplace musculoskeletal conditions and repetitive strain injuries.' },
  { slug: 'muscle-tendon-ligament', title: 'Muscles, Tendons and Ligaments Injuries', description: 'Targeted treatment for soft tissue injuries including strains, tears, and inflammatory conditions.' },
  { slug: 'ankle-knee', title: 'Ankle and Knee Injuries/Problems', description: 'Biomechanical assessment and targeted rehabilitation for lower limb conditions and instability.' },
  { slug: 'frozen-shoulder', title: 'Frozen Shoulder', description: 'Specialised capsular mobilisation and graded stretching for adhesive capsulitis at all stages.' },
  { slug: 'tennis-elbow', title: 'Tennis Elbow', description: 'Targeted loading therapy for lateral epicondylitis and tendinopathy conditions.' },
  { slug: 'post-surgery-rehab', title: 'Rehabilitation Following Surgery', description: 'Structured progressive rehabilitation programs following orthopaedic and spinal surgery.' },
  { slug: 'disc-prolapses', title: 'Disc Prolapses', description: 'Specialist management of intervertebral disc herniation with conservative and progressive approaches.' },
  { slug: 'other', title: 'Other', description: 'Any other condition not listed above.' },
];

export const CONDITION_SLUGS = CONDITIONS.map(c => c.slug);

export const CLINIC_HOURS: Record<string, ClinicHours | null> = {
  Monday: { start: '16:30', end: '21:00' },
  Tuesday: { start: '16:30', end: '21:00' },
  Wednesday: { start: '16:30', end: '21:00' },
  Thursday: { start: '16:30', end: '21:00' },
  Friday: { start: '16:30', end: '21:00' },
  Saturday: { start: '08:00', end: '21:00' },
  Sunday: null,
};

export const SLOT_DURATION_MINUTES = 30;
export const BOOKING_WINDOW_WEEKS = 4;

export const CLINIC_INFO = {
  name: 'Elite Physio Clinics',
  phone: '+44 333 577 9553',
  email: 'elitephysioclinics@gmail.com',
  address: 'Mare Fair, Sol Central\nGround Floor, Unit 3\nNorthampton NN1 1SR',
};
