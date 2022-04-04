import { Injectable } from '@angular/core';
import { EMPTY, from, Observable } from 'rxjs';
import * as streamSaver from 'streamsaver';

import { Project } from '../../common/project.class';
import { ProjectFile } from '../../common/project-file.class';
import { SpaceSaveMode } from '../common/space-modes.enums';

@Injectable({
  providedIn: 'root',
})
export class SpaceFileService {
  constructor() {}

  saveProject(project: Project, mode: SpaceSaveMode): Observable<void> {
    if (mode == SpaceSaveMode.Local) {
      const files = project.files;
      if (files.length == 1) {
        return this.saveFile(files[0]);
      } else {
        return this.saveZip(project.files, project.name);
      }
    }
    return EMPTY;
  }

  saveFile(file: ProjectFile): Observable<void> {
    if (file.code.length == 0) {
      const outputStream = streamSaver.createWriteStream(file.name, {
        size: file.source.size,
      });
      const inputStream = file.source.stream();
      return this.write(inputStream, outputStream);
    } else {
      const blob = new Blob([file.code]);
      const outputStream = streamSaver.createWriteStream(file.name, {
        size: blob.size,
      });
      const inputStream = blob.stream();
      return this.write(inputStream, outputStream);
    }
  }

  saveZip(files: ProjectFile[], name: string): Observable<void> {
    const inputStream = createWriter({
      start(ctrl: any) {
        for (const file of files) {
          if (file.code.length == 0) {
            ctrl.enqueue(file.source, file.path);
          } else {
            ctrl.enqueue({
              name: file.path,
              stream: () => new Blob([file.code]).stream(),
            });
          }
        }
        ctrl.close();
      },
      async pull(ctrl: any) {
        // Egs: Download and zip
        // const url = 'https://d8d913s460fub.cloudfront.net/videoserver/cat-test-video-320x240.mp4'
        // const res = await fetch(url)
        // const stream = () => res.body
        // const name = 'streamsaver-zip-example/cat.mp4'
        //
        // ctrl.enqueue({ name, stream })
        // ctrl.close()
      },
    });

    const outputStream = streamSaver.createWriteStream(name + '.zip');
    return this.write(inputStream, outputStream);
  }

  private write(
    inputStream: ReadableStream,
    outputStream: WritableStream,
  ): Observable<void> {
    if (window.WritableStream && inputStream.pipeTo) {
      return from(inputStream.pipeTo(outputStream));
    } else {
      const writer = outputStream.getWriter();
      const reader = inputStream.getReader();
      const pump = async () => {
        reader.read().then((res: any) => {
          if (!res.done) {
            writer.write(res.value).then(pump);
          } else {
            writer.close();
          }
        });
      };
      return from(pump());
    }
  }
}

declare function createWriter(v: any): any;
