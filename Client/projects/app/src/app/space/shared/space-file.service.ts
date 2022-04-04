import { Injectable } from '@angular/core';

import { Project } from '../../common/project.class';
import { SpaceSaveMode } from '../common/space-modes.enums';

@Injectable({
  providedIn: 'root',
})
export class SpaceFileService {
  constructor() {}

  saveProject(project: Project, mode: SpaceSaveMode): void {
    if (mode == SpaceSaveMode.Local) {
      let files = project.files;
      if (files.length == 1) {
      } else {
      }
    }
  }
}
