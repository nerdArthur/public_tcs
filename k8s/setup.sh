#!/bin/sh

minikube start;
eval $(minikube docker-env);
minikube addons enable ingress;

deploy_db(){
    db_deploy_exists=`kubectl get deployments | grep -i mysql-depl`

    if [ ! -z  db_deploy_exists ]
    then
        echo "[MYSQL] DEPLOYNG DATABASE";
        kubectl apply -f mysql-depl.yaml;
    else
        echo "[MYSQL] DEPLOY ALREADY EXISTS";
    fi
}

deploy_db;

deploy_front_end() {
    frontend_image=`docker images | grep frontent`;

    if [ ! -z frontend_image ]
    then
        echo "[FRONT-END] CREATING IMAGE";
        cd ../frontend; docker build -t frontend .;

        echo "[FRONT-END] DEPLOYNG APP";
        cd ../k8s;
        kubectl apply -f frontend-depl.yaml;

    else
        echo "[FRONT-END] IMAGE ALREADY EXISTS";
        echo "[FRONT-END] DEPLOYNG APP";
        kubectl apply -f frontend-depl.yaml;
    fi
}

deploy_front_end;

deploy_app(){
    whats_image_exists=`docker images | grep -i whats`;

    if [ ! -z whats_image_exists ] 
    then
        cd ../whats;docker build -t whats .;
        echo "[APP] WHATS IMAGE CREATED";

        echo "[APP] DEPLOYNG APP";
        cd ../k8s;
        kubectl apply -f app-depl.yaml;
    else
        echo "[APP] WHATS IMAGE EXISTS";
        echo "[APP] DEPLOYNG APP";
        kubectl apply -f app-depl.yaml;
    fi
}

eval $(minikube docker-env);
deploy_app;

echo "[INGRESS] Deploing ingress..."
kubectl apply -f ./ingress.yaml;