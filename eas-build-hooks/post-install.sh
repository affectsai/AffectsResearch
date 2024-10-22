#!/bin/sh
./node_modules/npm-license-crawler/bin/npm-license-crawler --json ${EAS_BUILD_WORKINGDIR}/components/license/licences.json --onlyDirectDependencies

# Fetch and extract media bundle for CUADS...
mkdir -p ${EAS_BUILD_WORKINGDIR}/assets/media
if [ -z "${MEDIA_RETRIEVAL_PRIVATE_KEY}" ]; then
  echo "WARNING: MEDIA_RETRIEVAL_PRIVATE_KEY not set ... retrieval of CUADS media bundle may fail."
  scp -o StrictHostKeyChecking=no tim_affects_ai@api.affects.ai:~/cuads_media.tgz ${EAS_BUILD_WORKINGDIR}/assets/media/cuads_media.tgz
else
  chmod 400 ${MEDIA_RETRIEVAL_PRIVATE_KEY}
  scp -o StrictHostKeyChecking=no -i ${MEDIA_RETRIEVAL_PRIVATE_KEY} tim_affects_ai@api.affects.ai:~/cuads_media.tgz ${EAS_BUILD_WORKINGDIR}/assets/media/cuads_media.tgz
fi

tar -C ${EAS_BUILD_WORKINGDIR}/assets/media/ -zxvf ${EAS_BUILD_WORKINGDIR}/assets/media/cuads_media.tgz
