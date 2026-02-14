import { integer, pgTable, varchar, json, date, text } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits: integer().default(5),
});


export const projectsTable = pgTable("project",  {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId: varchar({ length: 255 }).notNull().unique(),
  projectName: varchar(),
  theme: varchar(),
  userInput: varchar(),
  device: varchar(),
  createdOn: date().defaultNow(),
  config: json(),
  userId: varchar().references(() => usersTable.email).notNull()
})

export const ScreenConfigTable = pgTable('screenconfig', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  projectId:varchar().references(()=> projectsTable.projectId),
  screenId: varchar(),
  screenName: varchar(),
  purpose: varchar(),
  screenDescription: varchar(),
  code:text(),

})