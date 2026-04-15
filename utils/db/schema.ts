import { integer, uuid, boolean, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users_table', {  // users_table
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    phone: text('phone'),
    stripe_id: text('stripe_id').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const licensesTable = pgTable('licenses_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    typeId: uuid('type_id').references(() => licenseTypeTable.id, { onDelete: 'set null' }),
    licenseNumber: text('license_number').notNull(),
    stateId: uuid('state_id').references(() => statesTable.id, { onDelete: 'set null' }),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const licenseTypeTable = pgTable('license_type_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    type: text('type').notNull().unique(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const statesTable = pgTable('states_table', {
    id: uuid('id').primaryKey().defaultRandom(),
    state: text('state').unique().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const coursesTable = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    description: text("description"),
    active: boolean('active').notNull().default(true),
    stripeProductId: text("stripe_product_id").unique(),
    courseMaterial: text("course_material"),
    totalQuestions: integer("total_questions").notNull().default(100), //for safety checking, compare with number of questions in questionsTable
    ceuValue: integer("ceu_value").notNull().default(8), //TODO: set sane default
    stateTags: text("state_tags"), //metadata from stripe product
    roleTags: text("role_tags"), //metadata from stripe product
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const pricesTable = pgTable('prices', {
    id: uuid('id').defaultRandom().primaryKey(),
    stripePriceId: text('stripe_price_id').notNull().unique(),
    productId: uuid('product_id')
        .notNull()
        .references(() => coursesTable.id, { onDelete: 'cascade' }),
    active: boolean('active').notNull().default(true),
    currency: text('currency').notNull(),     // Stripe: currency
    unitAmount: integer('unit_amount'),       // Stripe: unit_amount (cents; nullable sometimes)
    type: text('type').notNull(),             // Stripe: one_time | recurring
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const entitlementsTable = pgTable('entitlements', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
        .notNull()
        .references(() => coursesTable.id, { onDelete: 'cascade' }),
    orderId: text("order_id").notNull(),
    active: boolean('active').notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
    (table) => ({
        userCourseUnique: unique("entitlements_user_course_unique").on(
            table.userId,
            table.courseId
        ),
    })
);

export const enrollmentsTable = pgTable('enrollments', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
        .notNull()
        .references(() => coursesTable.id, { onDelete: 'cascade' }),
    status: text('status').default('active'),
    questionsAnswered: integer('questions_answered').default(0),
    correctAnswers: integer('correct_answers').default(0),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
},
    (table) => ({
        userCourseUnique: unique("enrollments_user_course_unique").on(
            table.userId,
            table.courseId
        ),
    })
);

export const questionsTable = pgTable('questions', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id')
        .notNull()
        .references(() => coursesTable.id, { onDelete: 'cascade' }),
    questionOrder: integer('question_order').notNull(), // do we need this?
    questionText: text('question_text').notNull(),
    active: boolean('active').notNull().default(true),
});

export const questionChoicesTable = pgTable('question_choices', {
    id: uuid('id').defaultRandom().primaryKey(),
    questionId: uuid('question_id')
        .notNull()
        .references(() => questionsTable.id, { onDelete: 'cascade' }),
    choiceOrder: integer('choice_order').notNull(),
    choiceText: text('choice_text').notNull(),
    isCorrect: boolean('is_correct').default(false)
});

export const courseAttemptsTable = pgTable('attempts', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
        .notNull()
        .references(() => coursesTable.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
        .notNull()
        .references(() => questionsTable.id, { onDelete: 'cascade' }),
    answerId: uuid('answer_id')
        .references(() => questionChoicesTable.id, { onDelete: 'cascade' }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
},
    (table) => ({
        userCourseUnique: unique("attempts_user_course_question_unique").on(
            table.userId,
            table.courseId,
            table.questionId
        ),
    }));

export type InsertUser = typeof usersTable.$inferInsert;  //defines the row data going in for users_table
export type SelectUser = typeof usersTable.$inferSelect;  //defines the row data coming out for users_table
export type InsertProduct = typeof coursesTable.$inferInsert;
export type SelectProduct = typeof coursesTable.$inferSelect;
export type InsertEntitlements = typeof entitlementsTable.$inferInsert;
export type SelectEntitlements = typeof entitlementsTable.$inferSelect;
