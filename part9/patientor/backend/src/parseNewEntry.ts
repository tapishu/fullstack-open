
import { z } from 'zod';
import {HealthCheckRating} from "./types.ts";



const baseEntrySchema =  z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
diagnosisCodes: z.array(z.string()).optional()
});

const healthCheckEntrySchema =baseEntrySchema.extend ({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.union([
    z.literal(HealthCheckRating.Healthy),
    z.literal(HealthCheckRating.LowRisk),
    z.literal(HealthCheckRating.HighRisk),
    z.literal(HealthCheckRating.CriticalRisk),
])
});

const occupationalHealthcareEntrySchema =baseEntrySchema.extend ( {
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
    sickLeave: z.object({
startDate: z.string(),
endDate: z.string(),
    }).optional()
});

const hospitalEntrySchema =baseEntrySchema.extend ({
  type: z.literal("Hospital"),
  discharge: z.object({
    date:z.string(),
    criteria:z.string()
  })
});

const parseNewEntrySchema = z.discriminatedUnion("type", [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
]);

export const parseNewEntry = (object:unknown) =>{
  return parseNewEntrySchema.parse(object);
};


// export default parseNewPatient;
