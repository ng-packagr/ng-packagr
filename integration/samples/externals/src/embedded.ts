import { InjectionToken } from "@angular/core"
import trimLines from "trim-newlines";

export const trim = trimLines.start("hello ");
export const inject = new InjectionToken("token");
